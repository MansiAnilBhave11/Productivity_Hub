import jwt from "jsonwebtoken"
import User from "../models/User.js"

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. No valid token provided.",
      })
    }

    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated.",
      })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." })
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." })
    }

    console.error("Auth middleware error:", error)
    res.status(500).json({ message: "Server error during authentication." })
  }
}

export default auth
