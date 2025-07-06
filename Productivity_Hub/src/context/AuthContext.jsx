"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      axios
        .get("/api/auth/me")
        .then((response) => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
          toast.error("Session expired. Please login again.")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)
      toast.success(`Welcome back, ${user.name}!`)

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", { name, email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}` // its is passing token from backend to frontend

      setUser(user)
      toast.success(`Welcome to Productivity Hub, ${user.name}!`) // its is showing message in the frontend

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    toast.success("Logged out successfully!")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
