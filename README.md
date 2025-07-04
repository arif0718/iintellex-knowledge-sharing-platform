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

## 🖼️Destop Screenshots

| Login Page | Home Page |
|------------|------------|
| ![Login](https://github.com/user-attachments/assets/0b5d0bc7-8849-488a-a276-45873338e9ee) | ![Home](https://github.com/user-attachments/assets/030c8b4e-b1e1-4d84-9146-95c8c1fe102b)|
| Chat Page | Insights Page |
| ![Chat](https://github.com/user-attachments/assets/ad340d08-a90a-4a2e-aa31-5eefb0877542) | ![Insights](https://github.com/user-attachments/assets/f1236691-1a51-410d-8b13-51bf606817dd) |
| Profile Page | Profile Update Page |
| ![Profile](https://github.com/user-attachments/assets/c18aa39d-36fb-45d5-9d05-bd43aaaf995b) | ![Profile Update](https://github.com/user-attachments/assets/23bac749-2187-4dac-98c8-b21f1f7e3cfe) |

---

## 🖼️Mobile Screenshots

| Login Page | Home Page | Profile Page |
|------------|-----------|--------------|
| ![image](https://github.com/user-attachments/assets/badf6bf6-5439-4649-88e1-0e422f51a536) | ![Home](https://github.com/user-attachments/assets/056a6528-b4fa-443b-a183-9646c7d03d40) | ![Profile](https://github.com/user-attachments/assets/f36db922-67f5-41c1-9962-bdcf3afff6f3) |
| Insights Page | Right Sidebar | Chat Page |
| ![Insights](https://github.com/user-attachments/assets/e6018d28-c644-4274-a50d-70e823a6e36a) | ![Right Sidebar](https://github.com/user-attachments/assets/34d60205-24e3-489e-bd63-2a322c402d34) |![Chats](https://github.com/user-attachments/assets/d302dd45-7df5-401b-95c9-5536e26e8d61) |

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
