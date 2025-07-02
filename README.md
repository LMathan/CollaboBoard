# 🧩 CollaboBoard

**CollaboBoard** is a full-stack real-time collaborative to-do board, inspired by Trello. It allows multiple users to register, log in, manage tasks, and collaborate live on a Kanban board with features like drag-and-drop, Smart Assign, and conflict resolution.

---


## ⚙️ Tech Stack

**Frontend:**
- React.js
- Vite
- Custom CSS
- HTML5 Drag & Drop
- Socket.IO (real-time updates)
- Vercel (deployment)

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT + bcrypt (authentication)
- Socket.IO
- Render (deployment)

---

## ✨ Features

- 🔐 Secure user login & registration (JWT + hashed passwords)
- 📌 Create, update, delete, and assign tasks with status and priority
- 🔁 Real-time sync across clients via Socket.IO
- 🧠 Smart Assign: Automatically assigns task to user with fewest active tasks
- ⚔️ Conflict Handling: Detect and resolve simultaneous edits
- 📋 Activity Log: Displays last 20 actions in real-time
- 🖱 Drag-and-drop task movement between columns
- 📱 Responsive design for desktop and mobile

---

## 📁 Project Structure

/collaboboard
├── /client # React frontend
└── /server # Express backend


