# 🧩 CollaboBoard – Real-Time Collaborative To-Do App

CollaboBoard is a full-stack, real-time collaborative to-do board inspired by Trello. It allows multiple users to register, log in, manage tasks, and collaborate live on a Kanban-style board. Key features include drag-and-drop task management, real-time updates, Smart Assign logic, and conflict resolution handling.

---

## 🚀 Live Demo

🔗 **Live App**: [https://collaboboard.onrender.com](https://collaboboard.onrender.com)  

---

## 🛠 Tech Stack

**Frontend:**
- React.js
- Vite
- Custom CSS (no UI libraries)
- Socket.IO (client)

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO (server)
- JWT for authentication
- Bcrypt for password hashing

**Other:**
- Replit (development)
- Render (deployment)
- GitHub (version control)

---

## 📦 Features & Usage Guide

### 🔐 Authentication
- Register and login securely using JWT tokens.
- Passwords are hashed using Bcrypt.
- Only authenticated users can access the board.

### 🧮 Task Management
- Tasks include title, description, status, priority, and assigned user.
- Tasks can be created, updated, deleted, and reassigned.
- Columns: **Todo**, **In Progress**, and **Done**.
- Drag and drop tasks across columns.

### 🔁 Real-Time Collaboration
- All changes are synced instantly using Socket.IO.
- Multiple users can collaborate live.

### 📜 Activity Log
- Tracks the last 20 actions (create, edit, delete, move, assign).
- Updates in real time.
- Shows who did what and when.

### 🤖 Smart Assign
- Assigns a task to the user with the fewest active tasks.
- Click the “Smart Assign” button on any task to trigger.

### ⚔️ Conflict Handling
- When two users edit the same task, a conflict is detected via timestamp.
- The app shows both versions and allows the user to **merge** or **overwrite**.

### 📱 Responsive Design
- Fully responsive for mobile and desktop views.

---

## 🧠 Logic Explanations

### ✅ Smart Assign Logic
When the **Smart Assign** button is clicked:
- The backend fetches all users and counts their current active tasks (status: Todo or In Progress).
- The task is automatically assigned to the user with the fewest tasks.
- The update is broadcast live via Socket.IO to all connected clients.

### ✅ Conflict Handling Logic
When two users edit the same task at once:
- A `lastEdited` timestamp is stored for each task.
- If two users save changes with mismatched timestamps, the app detects the conflict.
- The user is shown both their version and the latest version from the DB.
- They can choose to **merge** fields or **overwrite** the current task.

---

## ⚙️ Setup Instructions

### 📁 Folder Structure
/
├── client/ → React frontend
├── server/ → Node.js backend
└── shared/ → Shared schema/utils

---

### 📌 Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

---

### 📥 Clone the Repository

```bash
git clone https://github.com/LMathan/CollaboBoard.git
cd CollaboBoard
---

🔧 Environment Setup
1. Create .env files in both client/ and server/
Example: /server/.env

PORT=5000
MONGO_URI=**************
JWT_SECRET=your_jwt_secret
Example: /client/.env

VITE_API_URL=http://localhost:5000
▶️ Run Backend

cd server
npm install
npm start

▶️ Run Frontend
Open new terminal:
cd client
npm install
npm run dev
Visit: http://localhost:5173

🧪 Testing the App
Register multiple users

Create tasks and assign them

Try real-time sync in multiple tabs

Click Smart Assign on a task

Test drag-and-drop and activity logs

Attempt conflict by editing a task in two tabs

📁 .env.example Files
Both /client and /server include .env.example to help you set up environment variables easily.

📄 Logic Document
For more details on Smart Assign and Conflict Handling logic, see Logic_Document.md.