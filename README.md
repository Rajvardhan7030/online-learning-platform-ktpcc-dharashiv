
# CodeLearn: Interactive Full-Stack Learning Platform

An advanced, interactive E-Learning platform designed to teach web development through a hybrid AI-content delivery system and an integrated live-coding IDE. 

## 🚀 Key Features

* **Hybrid AI-Content Delivery:** Merges curated, time-trimmed YouTube video tutorials with AI-generated documentation and AI-voiced podcasts.
* **Full Localization (L10n):** Core learning modules (Podcasts and Documentation) are fully localized in both English and Hindi, dynamically switching based on user preference.
* **Integrated Web IDE:** Features a custom-built React environment where users can instantly practice the code they just learned.
* **Cross-Port Authentication:** Utilizes a secure, custom token-bridge to seamlessly authenticate users between the static frontend and the React IDE backend.
* **Modular Curriculum Architecture:** A scalable data structure currently demonstrating a complete "Vertical Slice" of HTML & CSS fundamentals, with built-in graceful fallbacks for upcoming languages.
* **Responsive 3D UI:** Custom-built Vanilla CSS interface featuring hardware-accelerated 3D flip cards, reactive SVG/CSS avatars, and interactive state management.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript 
* **Web IDE Micro-Frontend:** React.js
* **Backend API:** Node.js, Express.js, JWT Authentication
* **Database:** MongoDB
* **DevOps / Deployment:** Docker, Docker Compose, Nginx
* **Content Generation:** NotebookLM (Audio), LLM (Text), YouTube Embed API

## 🏗️ System Architecture & Ports

This project utilizes a distributed micro-architecture, running across distinct environments simultaneously:
* **`Port 5500` (or `80` in Docker):** Main E-Learn Platform (Vanilla UI)
* **`Port 5000`:** Node.js API Backend
* **`Port 27017`:** MongoDB Database
* **`Port 3000`:** Interactive React IDE

---

## ⚙️ Installation & Setup Guide

### Prerequisites (For Manual Setup)
* **Node.js** (v16 or higher)
* **MongoDB** installed and running locally
* **Git**

---

### Method 1: Docker Deployment (Highly Recommended)
Containerizing the environment ensures it runs flawlessly regardless of your operating system. *Note: You must have Docker Desktop installed and running.*

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/yourusername/online-learning-platform.git](https://github.com/yourusername/online-learning-platform.git)
   cd online-learning-platform

2. **Set up Environment Variables:**
Create a `.env` file in the root directory (for Docker Compose) and add your custom configuration (e.g., `JWT_SECRET`, `REACT_APP_API_URL`).
Example `.env`:
```env
JWT_SECRET=your_secure_random_key_here
REACT_APP_API_URL=http://localhost:5000
```

3. **Launch the Entire Ecosystem:**
```bash
docker-compose up --build -d
```
4. **Access the application:**
Open your preferred browser and navigate to http://localhost:5500. The React IDE will automatically be available at http://localhost:3000.

---


### Method 2: Linux Setup (Manual)

1. **Start MongoDB:**
* Arch Linux: `sudo systemctl start mongodb`
* Ubuntu/Debian: `sudo systemctl start mongod`


2. **Setup the Backend:**
```bash
cd backend
npm install
node server.js

```


*(Wait for the `✅ MongoDB connected successfully` message)*
3. **Setup the React IDE:**
Open a new terminal:
```bash
cd ide-frontend
npm install
npm start

```


4. **Serve the Frontend:**
Open the root project folder in VS Code and click **Go Live** using the Live Server extension. Ensure it is running on `http://127.0.0.1:5500`.

---

### Method 3: Windows Setup (Manual)

1. **Start MongoDB:**
Ensure MongoDB Compass or the local MongoDB service is actively running in the background.
2. **Setup the Backend:**
Open Command Prompt or PowerShell:
```cmd
cd backend
npm install node server.js

```


3. **Setup the React IDE:**
Open a new Command Prompt:
```cmd
cd ide-frontend
npm install
npm start

```


4. **Serve the Frontend:**
Open the root folder in VS Code, right-click `index.html`, and select **Open with Live Server**.

---

## 🆘 Troubleshooting

**1. Docker Error: `failed to bind host port 0.0.0.0:27017/tcp: address already in use**`

* **Cause:** Your local installation of MongoDB is running in the background and blocking Docker from using the port.
* **Fix:** Stop your local MongoDB service (`sudo systemctl stop mongod` on Linux, or stop the service in Windows Task Manager), then run `docker compose up` again.

**2. Linux Docker Error: `permission denied while trying to connect to the docker API at unix:///var/run/docker.sock**`

* **Cause:** Your Linux user account is not part of the `docker` group.
* **Fix:** Run the command with sudo (`sudo docker compose up`), or permanently fix it by adding your user to the group: `sudo usermod -aG docker $USER` (requires terminal restart).

**3. Backend crashes with `MongooseServerSelectionError: getaddrinfo EAI_AGAIN mongodb**`

* **Cause:** A Docker race condition. Node.js booted faster than MongoDB and panicked when it couldn't find the database.
* **Fix:** The `docker-compose.yml` file is configured with `restart: on-failure`. Simply wait 2 seconds; Docker will automatically reboot the backend, and it will successfully connect on the second try.

**4. Frontend Error: `405 Method Not Allowed` when Logging In**

* **Cause:** The frontend HTML form is trying to send a POST request to Live Server instead of the Node backend.
* **Fix:** Ensure the `fetch()` URLs in `auth.js` explicitly point to `http://localhost:5000/api/auth/login`.

---

## 🗺️ Roadmap (Future Scope)

* **Student Dashboard:** Visual progress tracking and course completion analytics.
* **Expanded Curriculum:** Populating JavaScript, Python, and Java modules.
* **IDE Enhancements:** Adding terminal emulation for backend languages.

## 🤝 Acknowledgments

* developed as group project
* **Google Gemini AI:** Utilized as a pair-programming assistant for architectural brainstorming, debugging complex UI/backend integrations, and optimizing code structure.
* **NotebookLM:** Used to generate the localized AI podcast audio files for the educational content.
* **Grok:** Used for research of technology and structuring the syllabus.

