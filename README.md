<div align="center">

![image](https://github.com/user-attachments/assets/bbe2aa33-ed40-4f03-a3bc-602dcd4fa500)

This project is a web-based application that utilizes real-time object detection to identify and label objects within an image or video stream. It is built using **Next.js**, **ONNXRuntime**, **YOLOv7**, and **YOLOv10** models.  

</div>  

---

## 🔎 Features  

- ⚡ **Real-time object detection** using YOLOv7 and YOLOv10 models.  
- 🛠️ Support for **custom model integration**.  
- 🌐 **PWA support** for offline usage and native-like installation.  

---

## 🚀 Getting Started  

Follow these steps to set up and run the project on your local machine.  

### ✅ Prerequisites  

Ensure you have the following installed:  

- [🔗 Node.js](https://nodejs.org)  
- A modern web browser 🖥️  

### 📦 Installation  

1. Clone the repository to your local machine:  
   ```bash  
   git clone https://github.com/Carbon-Detection/cd-frontend.git  
   ```  

2. Navigate to the project directory:  
   ```bash  
   cd carbon-detection-web  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   # or  
   yarn install  
   ```  

4. Start the development server:  
   ```bash  
   npm run dev  
   # or  
   yarn dev  
   ```  

5. Open your web browser and go to [http://localhost:3000](http://localhost:3000) to view the app.  

---

## 🔧 Adding Custom Models  

1. ➕ Add your custom model to the `/models` directory.  
2. 📝 Update the `RES_TO_MODEL` constant in `components/models/Yolo.tsx` with your model's resolution and path.  
3. 🛠️ Adjust the `preprocess` and `postprocess` functions in `components/models/Yolo.tsx` for your model's input/output requirements.  
4. ⚠️ If encountering a `protobuff error` while loading `.onnx` models, convert them to `.ort` or optimized `.onnx` using [onnxruntime](https://onnxruntime.ai/docs/performance/model-optimizations/ort-format-models.html). Refer to [ultralytics_pt_to_onnx.md](./ultralytics_pt_to_onnx.md) for an example.  

---

## 📲 Installation as PWA  

You can install this app as a **Progressive Web App (PWA)**:  

1. Visit the app in a compatible web browser (e.g., Chrome, Firefox).  
2. 🖱️ Click the "Install" or "Add to Homescreen" button in the browser's interface.  
3. 📥 Follow the prompts to install the app.  
4. The app will be available on your device like a native app.  

---

## 🌎 Deployment  

To deploy the application for public use, refer to the official [Next.js deployment documentation](https://nextjs.org/docs/deployment).  

---

## 🛠️ Built With  

- ⚛️ [Next.js](https://nextjs.org/) - A React framework for building web applications.  
- 🤖 [ONNXRuntime](https://onnxruntime.ai/) - An open-source runtime for pre-trained models.  
- 🦾 [YOLOv7](https://github.com/WongKinYiu/yolov7) - A real-time object detection model.  
- 🚀 [YOLOv10](https://github.com/THU-MIG/yolov10) - A state-of-the-art object detection model.  
- 📱 [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) - A technology enabling web apps to work offline and behave like native apps.  

---

## 📝 License  

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE.md) file for details.  

---

## ✍️ Authors  

- **Iane Victória** - Initial work - [@ianevictoria](https://github.com/ianevictoria)  

---

## 📚 Citation  

### YOLOv10  

```  
@article{THU-MIGyolov10,  
title={YOLOv10: Real-Time End-to-End Object Detection},  
author={Ao Wang, Hui Chen, Lihao Liu, et al.},  
journal={arXiv preprint arXiv:2405.14458},  
year={2024},  
institution={Tsinghua University},  
license = {AGPL-3.0}  
}  
```  

### YOLOv7  

```  
@article{wang2022yolov7,  
title={{YOLOv7}: Trainable bag-of-freebies sets new state-of-the-art for real-time object detectors},  
author={Wang, Chien-Yao and Bochkovskiy, Alexey and Liao, Hong-Yuan Mark},  
journal={arXiv preprint arXiv:2207.02696},  
year={2022}  
}  
```  
