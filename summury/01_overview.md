# CodeLearn: Project Overview & System Architecture

## The Vision
CodeLearn is a hybrid e-learning platform. Unlike traditional sites that just show videos, CodeLearn integrates a live coding environment directly into the learning flow.

## The Three Pillars
Our project is built using a "Micro-Frontend" inspired approach:
1. **Main Platform (Port 5500):** Built with Vanilla HTML/CSS/JS for SEO efficiency and fast loading. This handles the landing page, tutorials, and user settings.
2. **Interactive IDE (Port 3000):** A React.js application using the Monaco Editor (the core of VS Code). It runs in a separate environment to keep the heavy code editing logic isolated from the main site.
3. **Backend API (Port 5000):** A Node.js/Express server that acts as the brain, handling authentication, database queries, and code snippet storage.

## How they Connect
- The **Main Platform** and **IDE** communicate via `localStorage` and URL parameters.
- Both frontends talk to the **Backend API** using RESTful calls (Fetch API).
- The **MongoDB** database persists all user and code data.
