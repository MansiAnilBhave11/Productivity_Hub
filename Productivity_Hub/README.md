# 🚀 My Productivity Hub - Enhanced MERN Stack

A modern, feature-rich productivity application built with the MERN stack featuring a stunning UI, smooth animations, and comprehensive functionality for managing notes and todos.

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based authentication with secure token handling
- Password hashing with bcryptjs
- Rate limiting for API protection
- Input validation and sanitization
- Secure CORS configuration

### 📝 **Notes Management**
- Create, read, update, delete notes
- Rich text content support
- Search functionality
- Pinning important notes
- Tagging system
- Responsive grid layout with animations

### ✅ **Todo Management**
- Add, edit, delete tasks
- Toggle completion status
- Priority levels (low, medium, high)
- Due date tracking
- Category organization
- Progress tracking with statistics
- Bulk operations support

### 🎨 **Modern UI/UX**
- Glass morphism design
- Smooth animations with Framer Motion
- Responsive design for all devices
- Beautiful gradient backgrounds
- Interactive hover effects
- Toast notifications
- Loading states and error handling

### 🔧 **Technical Features**
- Server-side pagination
- Advanced search and filtering
- Database indexing for performance
- Error handling and logging
- Health check endpoints
- Graceful shutdown handling

## 🛠️ Tech Stack

**Frontend:**
- React.js 18 with Vite
- Framer Motion for animations
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- Axios for API calls
- React Router DOM for navigation

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Helmet for security headers
- Morgan for logging
- Express Rate Limit for protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd productivity-hub-enhanced
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   \`\`\`

3. **Environment Setup**
   
   Create `server/.env` file:
   \`\`\`env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/productivity-hub
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   \`\`\`

4. **Start the application**
   \`\`\`bash
   # Option 1: Start both frontend and backend together
   npm start
   
   # Option 2: Start separately
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📁 Project Structure

\`\`\`
productivity-hub-enhanced/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Login.jsx           # Login form
│   │   ├── Register.jsx        # Registration form
│   │   ├── Notes.jsx           # Notes management
│   │   ├── Todos.jsx           # Todo management
│   │   └── LoadingSpinner.jsx  # Loading component
│   ├── context/                # React context
│   │   └── AuthContext.jsx     # Authentication context
│   ├── index.css               # Global styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # App entry point
├── server/                      # Backend Express application
│   ├── models/                 # MongoDB models
│   │   ├── User.js            # User model
│   │   ├── Note.js            # Note model
│   │   └── Todo.js            # Todo model
│   ├── routes/                 # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── notes.js           # Notes CRUD routes
│   │   └── todos.js           # Todos CRUD routes
│   ├── middleware/             # Custom middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── .env                   # Environment variables
│   ├── package.json           # Backend dependencies
│   └── server.js              # Server entry point
├── package.json                # Frontend dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js             # Vite configuration
└── README.md                   # Project documentation
\`\`\`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Notes
- `GET /api/notes` - Get all user notes (with pagination & search)
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/bulk-delete` - Delete multiple notes

### Todos
- `GET /api/todos` - Get all user todos (with filters & pagination)
- `GET /api/todos/:id` - Get specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `POST /api/todos/bulk-complete` - Mark multiple todos as complete
- `POST /api/todos/bulk-delete` - Delete multiple todos

## 🎨 UI Features

### Design Elements
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Page transitions and micro-interactions
- **Responsive Design**: Works perfectly on all screen sizes
- **Interactive Elements**: Hover effects and button animations

### User Experience
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error messages and recovery
- **Form Validation**: Client and server-side validation
- **Keyboard Shortcuts**: Enhanced accessibility

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Security Headers**: Helmet.js for additional security

## 📊 Performance Optimizations

- **Database Indexing**: Optimized queries for better performance
- **Pagination**: Efficient data loading for large datasets
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression for API responses

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy the `server` folder
4. Update CORS settings for production

### Environment Variables for Production
\`\`\`env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- MongoDB team for the excellent database
- All open-source contributors who made this project possible

---

**Happy Coding! 🎉**

For support or questions, please open an issue on GitHub.
