import React, { createContext, useContext, useRef, useState } from 'react';
import { runModelUtils } from '../utils';
import ndarray from 'ndarray';
import { Tensor } from 'onnxruntime-web';
import ops from 'ndarray-ops';
import ObjectDetectionCamera from '../components/ObjectDetectionCamera';
import { round } from 'lodash';
import { yoloClasses } from '../data/yolo_classes';
import Webcam from 'react-webcam';

type Theme = 'dark' | 'light';
type Language = 'en' | 'pt-BR';

interface AppContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<any>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const RES_TO_MODEL: [number[], string][] = [
    [[256, 256], 'yolov10n.onnx'],
    [[256, 256], 'yolov7-tiny_256x256.onnx'],
    [[320, 320], 'yolov7-tiny_320x320.onnx'],
    [[640, 640], 'yolov7-tiny_640x640.onnx'],
  ];
  const [theme, setTheme] = useState<Theme>('dark');
  const [language, setLanguage] = useState<Language>('en');
    const [modelResolution, setModelResolution] = useState<number[]>(RES_TO_MODEL[0][0]);
    const [modelName, setModelName] = useState<string>(RES_TO_MODEL[0][1]);
    const [session, setSession] = useState<any>(null);
    const [emissions, setEmissions] = useState<number>(0); // Emissões do frame atual
      const [isDetecting, setIsDetecting] = useState(true);
      const [totalTime, setTotalTime] = useState(0);
      const [inferenceTime, setInferenceTime] = useState(0);
      const [totalEmissions, setTotalEmissions] = useState<number>(0); // Emissões acumuladas

      const webcamRef = useRef<Webcam>(null);

      const [facingMode, setFacingMode] = useState<string>('environment');
      const originalSize = useRef<number[]>([0, 0]);

  const liveDetection = useRef<boolean>(false);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);

  function postprocessYolov10(
    ctx: CanvasRenderingContext2D,
    modelResolution: number[],
    tensor: Tensor,
    conf2color: (conf: number) => string,
    detectedClasses: string[]
  ) {
    const dx = ctx.canvas.width / modelResolution[0];
    const dy = ctx.canvas.height / modelResolution[1];
  
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    let x0:any, y0:any, x1:any, y1:any, cls_id:any, score:any;
    for (let i = 0; i < tensor.dims[1]; i += 6) {
      [x0, y0, x1, y1, score, cls_id] = tensor.data.slice(i, i + 6);
      if (score < 0.25) {
        break;
      }
  
      const detectedClass = yoloClasses[cls_id];
      detectedClasses.push(detectedClass);
  
      [x0, x1] = [x0, x1].map((x) => x * dx);
      [y0, y1] = [y0, y1].map((x) => x * dy);
  
      [x0, y0, x1, y1, cls_id] = [x0, y0, x1, y1, cls_id].map((x) => round(x));
  
      [score] = [score].map((x) => round(x * 100, 1));
      const label = detectedClass[0].toUpperCase() + detectedClass.substring(1) + ' ' + score.toString() + '%';
      const color = conf2color(score / 100);
  
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.font = '20px Arial';
      ctx.fillStyle = color;
      ctx.fillText(label, x0, y0 - 5);
  
      ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  
  function postprocessYolov7(
    ctx: CanvasRenderingContext2D,
    modelResolution: number[],
    tensor: Tensor,
    conf2color: (conf: number) => string,
    detectedClasses: string[]
  ) {
    const dx = ctx.canvas.width / modelResolution[0];
    const dy = ctx.canvas.height / modelResolution[1];
  
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    let batch_id:any, x0:any, y0:any, x1:any, y1:any, cls_id:any, score:any;
    for (let i = 0; i < tensor.dims[0]; i++) {
      [batch_id, x0, y0, x1, y1, cls_id, score] = tensor.data.slice(i * 7, i * 7 + 7);
  
      const detectedClass = yoloClasses[cls_id];
      detectedClasses.push(detectedClass);
  
      [x0, x1] = [x0, x1].map((x) => x * dx);
      [y0, y1] = [y0, y1].map((x) => x * dy);
  
      [x0, y0, x1, y1, cls_id] = [x0, y0, x1, y1, cls_id].map((x) => round(x));
  
      [score] = [score].map((x) => round(x * 100, 1));
      const label = detectedClass[0].toUpperCase() + detectedClass.substring(1) + ' ' + score.toString() + '%';
      const color = conf2color(score / 100);
  
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
      ctx.font = '20px Arial';
      ctx.fillStyle = color;
      ctx.fillText(label, x0, y0 - 5);
  
      ctx.fillStyle = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }

  const runModel = async (ctx: CanvasRenderingContext2D) => {
    const data = preprocess(ctx);
    let outputTensor: Tensor;
    let inferenceTime: number;
    [outputTensor, inferenceTime] = await runModelUtils.runModel(
      session,
      data
    );

    postprocess(outputTensor, inferenceTime, ctx, modelName);
    setInferenceTime(inferenceTime);
  };

  const capture = () => {
    const canvas = videoCanvasRef.current!;
    const context = canvas.getContext('2d', {
      willReadFrequently: true,
    })!;

    if (facingMode === 'user') {
      context.setTransform(-1, 0, 0, 1, canvas.width, 0);
    }

    context.drawImage(
      webcamRef.current!.video!,
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (facingMode === 'user') {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    return context;
  };

  
  const processImage = async () => {
    reset();
    const ctx = capture();
    if (!ctx) return;

    // create a copy of the canvas
    const boxCtx = document
      .createElement('canvas')
      .getContext('2d') as CanvasRenderingContext2D;
    boxCtx.canvas.width = ctx.canvas.width;
    boxCtx.canvas.height = ctx.canvas.height;
    boxCtx.drawImage(ctx.canvas, 0, 0);

    await runModel(boxCtx);
    ctx.drawImage(boxCtx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const reset = async () => {
    var context = videoCanvasRef.current!.getContext('2d')!;
    context.clearRect(0, 0, originalSize.current[0], originalSize.current[1]);
    liveDetection.current = false;
  };

  const runLiveDetection = async () => {
    if (liveDetection.current) {
      liveDetection.current = false;
      return;
    }
    liveDetection.current = true;
    while (liveDetection.current) {
      const startTime = Date.now();
      const ctx = capture();
      if (!ctx) return;
      await runModel(ctx);
      setTotalTime(Date.now() - startTime);
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve())
      );
    }
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };


   const changeModelResolution = (width?: number, height?: number) => {
      if (width !== undefined && height !== undefined) {
        setModelResolution([width, height]);
        return;
      }
      const index = RES_TO_MODEL.findIndex((item) => item[0] === modelResolution);
      if (index === RES_TO_MODEL.length - 1) {
        setModelResolution(RES_TO_MODEL[0][0]);
        setModelName(RES_TO_MODEL[0][1]);
      } else {
        setModelResolution(RES_TO_MODEL[index + 1][0]);
        setModelName(RES_TO_MODEL[index + 1][1]);
      }
    };
  
    const resizeCanvasCtx = (
      ctx: CanvasRenderingContext2D,
      targetWidth: number,
      targetHeight: number,
      inPlace = false
    ) => {
      let canvas: HTMLCanvasElement;
  
      if (inPlace) {
        canvas = ctx.canvas;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.scale(targetWidth / canvas.clientWidth, targetHeight / canvas.clientHeight);
      } else {
        canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.getContext('2d')!.drawImage(ctx.canvas, 0, 0, targetWidth, targetHeight);
        ctx = canvas.getContext('2d')!;
      }
  
      return ctx;
    };
  
    const preprocess = (ctx: CanvasRenderingContext2D) => {
      const resizedCtx = resizeCanvasCtx(ctx, modelResolution[0], modelResolution[1]);
      const imageData = resizedCtx.getImageData(0, 0, modelResolution[0], modelResolution[1]);
      const { data, width, height } = imageData;
      const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
      const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [1, 3, width, height]);
  
      ops.assign(dataProcessedTensor.pick(0, 0, null, null), dataTensor.pick(null, null, 0));
      ops.assign(dataProcessedTensor.pick(0, 1, null, null), dataTensor.pick(null, null, 1));
      ops.assign(dataProcessedTensor.pick(0, 2, null, null), dataTensor.pick(null, null, 2));
      ops.divseq(dataProcessedTensor, 255);
  
      const tensor = new Tensor('float32', new Float32Array(width * height * 3), [1, 3, width, height]);
      (tensor.data as Float32Array).set(dataProcessedTensor.data);
      return tensor;
    };
  
    const conf2color = (conf: number) => {
      const r = Math.round(255 * (1 - conf));
      const g = Math.round(255 * conf);
      return `rgb(${r},${g},0)`;
    };
  
    const EMISSION_DATA: Record<string, number> = {
      person: 0,
      bicycle: 10,
      car: 150,
      motorcycle: 120,
      bus: 400,
      truck: 500,
      'traffic light': 0,
      'fire hydrant': 0,
      'stop sign': 0,
      'parking meter': 0,
      bench: 0,
      bird: 0,
      cat: 0,
      dog: 0,
      horse: 0,
      sheep: 0,
      cow: 0,
      elephant: 0,
      bear: 0,
      zebra: 0,
      giraffe: 0,
      backpack: 5,
      umbrella: 2,
      handbag: 5,
      tie: 1,
      suitcase: 10,
      frisbee: 1,
      skis: 5,
      snowboard: 5,
      kite: 1,
      'baseball bat': 3,
      'baseball glove': 3,
      skateboard: 5,
      surfboard: 10,
      'tennis racket': 2,
      bottle: 1,
      'wine glass': 1,
      cup: 1,
      fork: 0,
      knife: 0,
      spoon: 0,
      bowl: 1,
      banana: 0,
      apple: 0,
      sandwich: 0,
      orange: 0,
      broccoli: 0,
      carrot: 0,
      'hot dog': 0,
      pizza: 0,
      donut: 0,
      cake: 0,
      chair: 5,
      couch: 20,
      'potted plant': 0,
      bed: 15,
      'dining table': 20,
      toilet: 5,
      tv: 20,
      laptop: 5,
      mouse: 1,
      remote: 1,
      keyboard: 3,
      'cell phone': 3,
      microwave: 10,
      oven: 20,
      toaster: 5,
      sink: 10,
      refrigerator: 30,
      book: 1,
      clock: 3,
      vase: 2,
    };
  
    const postprocess = (
      outputTensor: Tensor,
      inferenceTime: number,
      ctx: CanvasRenderingContext2D,
      modelName: string
    ) => {
      const detectedClasses: string[] = [];
      let sumOfEmissions = 0;
  
      if (modelName.includes('yolov10')) {
        postprocessYolov10(ctx, modelResolution, outputTensor, conf2color, detectedClasses);
      } else if (modelName.includes('yolov7')) {
        postprocessYolov7(ctx, modelResolution, outputTensor, conf2color, detectedClasses);
      }
  
      detectedClasses.forEach((className) => {
        if (EMISSION_DATA[className] !== undefined) {
          sumOfEmissions += EMISSION_DATA[className];
        }
      });
  
      setEmissions(sumOfEmissions);
      setTotalEmissions((prevEmissions:any) => prevEmissions + sumOfEmissions); // Atualiza as emissões totais
  
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`Emissões: ${sumOfEmissions}g CO2`, 10, 30);
    };

  return (
    <AppContext.Provider value={{ theme, language, toggleTheme, setLanguage, liveDetection, runLiveDetection, reset, processImage, videoCanvasRef,preprocess, postprocess, changeModelResolution, modelResolution, setModelResolution, modelName, setModelName,session, setSession,emissions,setEmissions, RES_TO_MODEL,  isDetecting, setIsDetecting, totalTime, setTotalTime, inferenceTime, setInferenceTime,totalEmissions, setTotalEmissions, postprocessYolov10, postprocessYolov7, capture, webcamRef, facingMode, setFacingMode, originalSize }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}