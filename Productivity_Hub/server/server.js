import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/auth.js"
import noteRoutes from "./routes/notes.js"
import todoRoutes from "./routes/todos.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(morgan("combined"))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Productivity Hub API is running",
    timestamp: new Date().toISOString(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", noteRoutes)
app.use("/api/todos", todoRoutes)

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/productivity-hub"

mongoose.set("strictQuery", false)

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`📡 API Health Check: http://localhost:${PORT}/health`)
    })
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  })

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...")
  await mongoose.connection.close()
  console.log("📊 MongoDB connection closed")
  process.exit(0)
})
