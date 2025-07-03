# 🧠 iintellex – Share Ideas, Ask Questions, Get Inspired

**iintellex** is a modern, full-stack MERN application built for collaborative knowledge sharing. Designed for students and professionals alike, it allows users to post questions, share insights, engage in real-time chat, and build meaningful connections. With features like following, commenting, and a personalized feed, iintellex blends the best of social media and educational platforms to foster an interactive learning community.

---

## 🚀 Features

- 🔐 **User Authentication**
  - Register / Login with JWT and bcrypt
  - Forgot & Reset Password via email
- 👤 **Profile System**
  - View, edit, and manage personal profiles
  - Follow / Unfollow other users
- 📝 **Post Management**
  - Create, update, delete posts with captions
  - Upload images via Cloudinary
  - Like & comment on posts
- 💬 **Real-time Chat**
  - 1:1 Messaging using Socket.io
  - Conversations persist in MongoDB
- 🔍 **Search Functionality**
  - Search users by username or email
- 🧭 **Responsive Design**
  - Fully mobile and desktop responsive with Tailwind CSS

---

## 🛠 Tech Stack

### Frontend:
- React.js + Vite
- Redux Toolkit for global state management
- Axios for API communication
- Tailwind CSS for styling
- shadcn/ui for modern, accessible, and reusable UI components

### Backend:
- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary (image uploads)
- JWT + bcrypt (authentication)
- Nodemailer (email service for password reset)
- Socket.io (real-time chat)

---

## 🌐 Live Demo

Website Link: [https://iintellex.vercel.app](https://iintellex.vercel.app)  

---

## 🖼️ Screenshots

| Login Page | Feed Page | Chat |
|------------|------------|------|
| ![Login](./screenshots/login.png) | ![Feed](./screenshots/feed.png) | ![Chat](./screenshots/chat.png) |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Email service credentials (e.g., Gmail App Password)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/iintellex.git
cd iintellex

cd backend
npm install
npm run dev

cd ../frontend
npm install
npm run dev
