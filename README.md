# 🛡️ SpamShield AI

An AI-powered email and message threat detection platform built using **Machine Learning, Flask, and Next.js**.

SpamShield AI analyzes incoming messages and identifies potential spam by combining machine learning predictions with rule-based threat analysis. The system detects suspicious links, email addresses, spam keywords, and generates an overall threat score to help users identify risky messages.

## 🚀 Live Demo

🔗 **Frontend:**
https://spam-shield-frvzoejlm-pragatigupta2508s-projects.vercel.app/

🔗 **Backend API:**
https://spam-shield-ai-backend.onrender.com/

## ✨ Features

* 🤖 Machine Learning-based Spam Detection
* 🔗 Suspicious Link Detection
* 📧 Email Address Detection
* 🚨 Threat Score Calculation
* 🛡️ Risk Level Assessment
* 📊 Interactive Security Dashboard
* 📱 Fully Responsive Design
* ☁️ Cloud Deployment (Render + Vercel)

## 🛠️ Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Flask
* Flask-CORS

### Machine Learning

* Scikit-Learn
* TF-IDF Vectorization
* Multinomial Naive Bayes
* Pandas
* NumPy

## 📂 Project Structure

```bash
SpamShieldAI/
│
├── backend/
│   ├── app.py
│   ├── train.py
│   ├── spam_model.pkl
│   ├── vectorizer.pkl
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── dataset/
    └── spam.csv
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Pragatigupta2508/Spam_Shield_AI.git
cd Spam_Shield_AI
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs on:

```bash
http://127.0.0.1:5000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

## 🧠 How It Works

1. User submits a message.
2. The message is processed using TF-IDF vectorization.
3. A trained Naive Bayes model predicts whether the message is spam.
4. Additional security checks identify:

   * Suspicious links
   * Email addresses
   * Spam keywords
5. A threat score is generated.
6. Results are displayed through an interactive dashboard.

## 📈 Future Improvements

* Real-time URL reputation analysis
* Phishing website detection
* User authentication
* Threat history tracking
* Email inbox integration
* Advanced NLP models

## 👩‍💻 Author

**Pragati Gupta**

Built with curiosity, secured with AI. ✨
