# CodeLearn: Interactive Full-Stack Learning Platform

An advanced, interactive E-Learning platform designed to teach web development through a hybrid AI-content delivery system and an integrated live-coding IDE. 

## 🚀 Key Features

* **Hybrid AI-Content Delivery:** Merges curated, time-trimmed YouTube video tutorials with AI-generated documentation and AI-voiced podcasts (created via NotebookLM).
* **Full Localization (L10n):** Core learning modules (Podcasts and Documentation) are fully localized in both English and Hindi, dynamically switching based on user preference.
* **Integrated Web IDE:** Features a custom-built React environment where users can instantly practice the code they just learned.
* **Cross-Port Authentication:** Utilizes a secure, custom token-bridge to seamlessly authenticate users between the static frontend (Live Server) and the React IDE backend.
* **Modular Curriculum Architecture:** A scalable data structure currently demonstrating a complete "Vertical Slice" of HTML & CSS fundamentals, with built-in graceful fallbacks for upcoming languages.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Vanilla UI for high performance)
* **IDE Application:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Content Generation:** NotebookLM (Audio), LLM (Text), YouTube Embed API

## 🏗️ System Architecture

This project utilizes a distributed micro-architecture, running across three distinct environments simultaneously:
1. **The Core UI:** Hosted via VS Code Live Server (typically Port `5500`).
2. **The Authentication/API Backend:** Node.js server connecting to MongoDB.
3. **The Practice IDE:** React application running on Port `3000`.

## ⚙️ Local Installation & Setup

To run this project locally, ensure you have **Node.js** and **MongoDB** installed on your system.

### 1. Database Setup
Ensure your local MongoDB server is running. 

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server:
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`

### 3. React IDE Setup
Open a new terminal, navigate to the IDE directory, install dependencies, and start the React app:
\`\`\`bash
cd react-ide
npm install
npm start
\`\`\`
*(This will automatically launch on `http://localhost:3000`)*

### 4. Frontend Setup
Open the project root in VS Code. Use the **Live Server** extension to serve `index.html`. 
*(Ensure this runs on `http://127.0.0.1:5500` so the cross-port authentication bridge functions correctly).*

## 🗺️ Roadmap (Future Scope)
* **Student Dashboard:** Visual progress tracking and course completion analytics.
* **Expanded Curriculum:** Populating JavaScript, Python, and Java modules.
* **IDE Enhancements:** Adding terminal emulation for backend languages.

## 🤝 Acknowledgments

* Developed as a final year Computer Science project.
* **Google Gemini AI:** Utilized as a pair-programming assistant for architectural brainstorming, debugging complex UI/backend integrations, and optimizing code structure.
* **NotebookLM:** Used to generate the localized AI podcast audio files for the educational content.
* **grok:** used to research of technology and structure syllabus 
