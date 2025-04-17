# 🛡️ AI-Powered Zero-Day Vulnerability Detection and Patch Recommendation System

This project is an end-to-end web application that detects zero-day vulnerabilities in source code and recommends automatic patches using AI/ML models. It includes a modern ReactJS frontend and a Python-based flask backend server.

---

## 🚀 Features

- Paste code snippets.
- Automatic detection of security vulnerabilities in source code.
- AI-powered patch generation to fix the vulnerabilities.
- Clean and intuitive user interface.
- Runs completely locally — no cloud dependency.

---

## 📦 Tech Stack

- **Frontend:** ReactJS + TailwindCSS
- **Backend:** Python (Flask)
- **ML Model:** Trained on a labeled dataset of vulnerable and safe code

---

## 🛠️ Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Pranavnk15/Final-Year-Project.git
cd Final-Year-Project
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

> The frontend will start at [http://localhost:5173](http://localhost:5173)

### 3. Start the Backend

> Ensure you've placed the trained model file `vulnerability_fixer_model.keras` inside the `model/` directory.

```bash
cd backend
python Backend.py
```

> The backend will run at [http://localhost:5000](http://localhost:5000)

---

## ✅ That’s It!

🎉 Your application is now up and running locally!

You can:
- Paste code snippets or GitHub URLs via the frontend
- Detect vulnerabilities
- Generate and view suggested patches in real-time

---

## 📂 Folder Structure

```
project-root/
│
├── frontend/         # React frontend app
│
├── backend/          # Python backend server
│
├── model/            # ML models and training scripts
│
└── README.md         # Project documentation
```
