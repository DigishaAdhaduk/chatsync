# ChatSync – Real-Time Chat Application

ChatSync is a real-time chat application built using the MERN stack. It enables users to communicate instantly in chat rooms, share files, and collaborate in a way similar to modern messaging platforms like Slack or WhatsApp. This project focuses on real-time communication, WebSockets, message persistence, authentication, and clean user experience.

## 🚀 Features

- User authentication (Register & Login)
- Real-time messaging using Socket.IO
- Create, join, leave, and delete chat rooms
- Invite users to rooms using unique invite codes
- Send text messages, images, and documents
- Media-only messages supported (text is optional)
- Persistent chat history stored in MongoDB
- Auto-scroll to the latest message
- Keyboard support (Enter key to send messages)
- Responsive and clean UI
- Custom modals instead of browser prompts

## 🛠 Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Node.js
- Express.js
- Socket.IO

Database:
- MongoDB

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18 or above recommended)
- MongoDB (running locally)

### Backend Setup
cd server  
npm install  
npm start  

Backend server runs on:  
http://localhost:5001

### Frontend Setup
cd client  
npm install  
npm run dev  

Frontend application runs on:  
http://localhost:5173

## 📸 Output Screenshots

### Login Page
![Login Page](./screenshots/login%20page.png)

### Register Page
![Register Page](./screenshots/register%20page.png)

## Home Page
![Home Page](./screenshots/home%20page.png)

### Create Group
![Create Group](./screenshots/create%20group.png)

### Chat Room
![Chat Room](./screenshots/chat%20room.png)

### File Upload
![File Upload](./screenshots/file%20upload.png)

### Other Features
![Other Features](./screenshots/other%20features.png)

## 🧠 Design & Architecture Notes

- Socket.IO is used for real-time bidirectional communication
- Messages are emitted only through the server to avoid duplication
- MongoDB stores users, rooms, and messages for persistence
- Invite codes allow users to join existing chat rooms securely
- Browser prompts are avoided in favor of controlled UI modals
- Codebase is kept simple, readable, and beginner-friendly

## 📌 Future Improvements (Optional)

- Typing indicators
- Read receipts
- Online/offline user status
- Emoji reactions

## ✅ Conclusion

ChatSync demonstrates a complete real-time chat system with authentication, group-based messaging, file sharing, and persistent chat history. The project closely resembles real-world chat applications and is suitable for learning as well as showcasing real-time web application development.
