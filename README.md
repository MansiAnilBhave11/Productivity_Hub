 ProductivityHub

A full-stack MERN (MongoDB, Express, React, Node.js) productivity management application that helps users organize their daily activities efficiently. It includes secure authentication, task tracking, and progress monitoring to boost focus and time management.

 Features: 

📝 To-Do List Management – Create, edit, delete, and mark tasks as completed.

⏳ Task Tracking – Keep track of daily and weekly productivity goals.

🔐 Secure Authentication – User login/signup using JWT (JSON Web Token) and bcrypt for password hashing.

🧭 Dashboard View – Displays all pending, completed, and upcoming tasks.

🌙 User-Friendly UI – Clean, responsive interface built with React.

☁️ Persistent Storage – Tasks are stored securely in MongoDB.

🔄 Real-Time Updates – Automatically updates task status without page reload.

🛠️ Tech Stack
Layer	Technology
Frontend	React.js, CSS, Axios
Backend	Node.js, Express.js
Database	MongoDB, Mongoose
Authentication	JWT, bcrypt.js
Hosting	Render / Vercel / MongoDB Atlas
⚙️ Installation
# Clone the repository
git clone https://github.com/yourusername/ProductivityHub.git

# Navigate to the project directory
cd ProductivityHub

# Install dependencies
npm install

# Go to client folder and install frontend dependencies
cd client
npm install

# Start both frontend and backend servers
npm run dev

🔑 Environment Variables

Create a .env file in the root folder and add:

MONGO_URI = your_mongodb_connection_string
JWT_SECRET = your_secret_key
PORT = 5000

🧩 Future Enhancements

📊 Add productivity analytics dashboard.

📅 Integrate Google Calendar API.

🔔 Add task reminder notifications.

🌓 Add dark/light theme toggle.

📱 Create a mobile-friendly PWA version.

💡 Motivation

ProductivityHub was built to simplify daily task management and help individuals stay consistent with their goals. The focus is on secure, simple, and efficient task tracking — all in one place.
