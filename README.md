# 🧬 AI-Powered Microscopic Cell Anomaly Detection

This project leverages **Deep Learning (VGG16)** and **AI-based visualization** to automatically detect anomalies in microscopic cell images. The system highlights infected or abnormal regions using a **heatmap overlay**, making it useful for medical research and diagnostic assistance.

---

## 🚀 Features

- 🔍 **Anomaly Detection** – Detects infected or abnormal cells using trained CNN (VGG16).  
- 🌡️ **Heatmap Visualization** – Highlights anomaly regions with Grad-CAM-like overlays.  
- ⚙️ **FastAPI Backend** – Efficient API for image upload and prediction.  
- 💻 **Frontend with Node.js + React** – Clean interface for uploading images and viewing results.  
- ☁️ **Deployed on Render** – Backend hosted on Render for live inference.  

---

## 🧠 Model Information

- **Base Model:** VGG16 (Pretrained on ImageNet)  
- **Training Epochs:** 20  
- **Training Accuracy:** 97.06%  
- **Validation Accuracy:** 92.50%  
- **Loss:** 0.0804 (Train) | 0.2095 (Validation)  

The model classifies cell images into:
- 🩸 **Infected (Anomalous) Cells**
- 🧫 **Uninfected (Normal) Cells**

---

## 🧪 Tech Stack

| Component | Technology Used |
|------------|-----------------|
| **Model** | TensorFlow, Keras (VGG16) |
| **Backend** | FastAPI |
| **Frontend** | Node.js, React |
| **Visualization** | Matplotlib, OpenCV |
| **Deployment** | Render |
| **Version Control** | Git & GitHub |

---

## ⚙️ How It Works

1. User uploads a microscopic cell image via the frontend.  
2. The image is sent to the FastAPI backend endpoint.  
3. The model processes the image and predicts anomaly regions.  
4. A **heatmap with bounding boxes** is generated to visualize affected areas.  
5. The result is returned and displayed on the frontend.

---

## 🖼️ Sample Output

> ✅ **Detected Anomaly (Heatmap Overlay)**  
> 🔲 Bounding boxes highlight infected areas within the cell structure.

---

## 🧾 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/predict` | Upload a microscopic image for anomaly detection |
| `GET` | `/` | Health check endpoint |

---



## ⚡ Installation Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Jaikumar2406/AI-Powered-Microscopic-Cell-Anomaly-Detection.git
cd AI-Powered-Microscopic-Cell-Anomaly-Detection
```
## Setup Backend
```cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
## Setup Frontend
```
cd frontend
npm install
npm start
```

## Training and Validation Loss

<img width="906" height="609" alt="image" src="https://github.com/user-attachments/assets/20ebe8af-fcd6-4ced-8e32-b8af8d0adeba" />


## Training and Validation accuracy

<img width="781" height="609" alt="image" src="https://github.com/user-attachments/assets/d566826a-b074-48fd-85aa-a23034f4c92f" />

## prediction output

<img width="725" height="629" alt="image" src="https://github.com/user-attachments/assets/305c933b-e045-4d7d-b02e-2e1194022ec8" />

## frontend

<img width="1891" height="922" alt="Screenshot 2025-10-26 012842" src="https://github.com/user-attachments/assets/601ba7c7-7b14-4da3-bc58-4f5ffe9340ee" />

