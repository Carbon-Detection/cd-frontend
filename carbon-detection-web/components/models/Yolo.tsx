import ndarray from 'ndarray';
import { Tensor } from 'onnxruntime-web';
import ops from 'ndarray-ops';
import ObjectDetectionCamera from '../ObjectDetectionCamera';
import { round } from 'lodash';
import { yoloClasses } from '../../data/yolo_classes';
import { useState, useEffect } from 'react';
import { runModelUtils } from '../../utils';
import { useApp } from '../../context/AppContext';



const Yolo = (props: any) => {


  const {preprocess, postprocess, changeModelResolution, modelResolution, setModelResolution, modelName, setModelName,session, setSession,emissions,setEmissions, RES_TO_MODEL, postprocessYolov10, postprocessYolov7} = useApp();
  

 

  useEffect(() => {
    const getSession = async () => {
      const session = await runModelUtils.createModelCpu(`./_next/static/chunks/pages/${modelName}`);
      setSession(session);
    };
    getSession();
  }, [modelName, modelResolution]);

 

  return (
    <ObjectDetectionCamera
      width={props.width}
      height={props.height}
      preprocess={preprocess}
      postprocess={postprocess}
      session={session}
      changeCurrentModelResolution={changeModelResolution}
      currentModelResolution={modelResolution}
      modelName={modelName}
      totalEmissions={props.totalEmissions}
      setInferenceTime={props.setInferenceTime}
      setTotalTime={props.setTotalTime}
    />
  );
};

export default Yolo;

