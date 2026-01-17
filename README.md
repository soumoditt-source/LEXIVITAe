# ⚔️ LexiVitae AI: The Autonomous Viva Examiner
> **Team:** Fullstack Shinobi | **Status:** Production Release (v3.2)

![Status](https://img.shields.io/badge/Status-Live_Production-success?style=for-the-badge)
![UI](https://img.shields.io/badge/UI-Responsive_Dual_Mode-purple?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue?style=for-the-badge)
![Framework](https://img.shields.io/badge/Frontend-Angular_19_Zoneless-red?style=for-the-badge)

## 📖 Overview
LexiVitae is a **Zero-Shot AI Proctor & Examiner** designed to automate oral assessments (Viva Voce) at scale. It ingests research papers or textbooks (PDF) and conducts a rigorous, voice-interactive interview in real-time.

**Now fully responsive across all devices (iOS, Android, Mac, Windows).**

### 🌟 Key Capabilities
*   **🧠 Semantic RAG Engine:** Generates deep "Why" and "How" questions from uploaded PDFs using Gemini 2.5 Flash (1M Context).
*   **🗣️ Dual-Mode Interview:** 
    *   **High-Contrast Toggle:** Switch seamlessly between "Type" and "Voice".
    *   **Voice Mode:** Continuous Speech-to-Text with a "Jarvis" visualizer.
    *   **Keyboard Mode:** Standard text input for precision.
*   **👁️ Shinobi Proctor:** Client-side TensorFlow.js vision detects forbidden objects (Phones/Books) and tab switching.
*   **📱 Adaptive UI:** Liquid layout that adjusts to any screen size or orientation.

## 🏗️ Architecture
1.  **Ingestion:** PDF.js extracts text client-side.
2.  **Context Analysis:** Gemini 2.5 analyzes the document to build a semantic map.
3.  **Interview Loop:** 
    *   Question Generation (Adaptive based on previous score).
    *   User Answer (Voice/Text).
    *   Proctor Check (TensorFlow.js).
    *   Grading (0-10 Score + Advice).
4.  **Reporting:** Generates an Excel transcript and Management Summary.

## 🛠️ Tech Stack
*   **Frontend:** Angular 19+ (Zoneless)
*   **AI Model:** Google Gemini 2.5 Flash
*   **Vision:** TensorFlow.js (COCO-SSD)
*   **Styling:** Tailwind CSS (Fluent Design)
*   **Deployment:** Vercel Edge / Netlify

## 🚀 Deployment Instructions

### Option 1: Vercel (Recommended)
1.  Clone this repository.
2.  Import to Vercel.
3.  Add Environment Variable: `API_KEY` (Your Google Gemini API Key).
4.  Deploy.

### Option 2: Local Development
1.  `npm install`
2.  Create `.env` or set `API_KEY` in your environment.
3.  `npm start` -> Open `http://localhost:4200`

---
*Built for High-Stakes Assessments.*
