"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { Plus, Search, Filter, MoreHorizontal, Check, Calendar, Trash2, Edit3, X, Save } from "lucide-react"

function Todos() {
  const { user } = useAuth()
  const [todos, setTodos] = useState([])
  const [text, setText] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos")
      setTodos(response.data)
    } catch (error) {
      toast.error("Failed to fetch tasks")
      console.error("Error fetching todos:", error)
    }
  }

  const handleCreateTodo = async () => {
    if (!text.trim()) {
      toast.error("Please enter a task")
      return
    }

    setLoading(true)
    try {
      await axios.post("/api/todos", { text })
      toast.success("Task created successfully!")
      setText("")
      fetchTodos()
    } catch (error) {
      toast.error("Failed to create task")
      console.error("Error creating todo:", error)
    }
    setLoading(false)
  }

  const handleUpdateTodo = async (id, updates) => {
    try {
      await axios.put(`/api/todos/${id}`, updates)
      if (updates.isCompleted !== undefined) {
        toast.success(updates.isCompleted ? "Task completed! 🎉" : "Task marked as pending")
      } else {
        toast.success("Task updated successfully!")
      }
      fetchTodos()
    } catch (error) {
      toast.error("Failed to update task")
      console.error("Error updating todo:", error)
    }
  }

  const handleDeleteTodo = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/todos/${id}`)
        toast.success("Task deleted successfully!")
        fetchTodos()
      } catch (error) {
        toast.error("Failed to delete task")
        console.error("Error deleting todo:", error)
      }
    }
  }

  const handleEditTodo = (todo) => {
    setEditingId(todo._id)
    setText(todo.text)
  }

  const handleSaveEdit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a task")
      return
    }

    setLoading(true)
    try {
      await handleUpdateTodo(editingId, { text })
      setEditingId(null)
      setText("")
    } catch (error) {
      // Error already handled in handleUpdateTodo
    }
    setLoading(false)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setText("")
  }

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    if (filter === "completed") return todo.isCompleted && matchesSearch
    if (filter === "pending") return !todo.isCompleted && matchesSearch
    return matchesSearch
  })

  const completedCount = todos.filter((todo) => todo.isCompleted).length
  const pendingCount = todos.filter((todo) => !todo.isCompleted).length

  // Get current user's initials for avatar
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const currentUser = {
    name: user?.name || "User",
    username: user?.name || "User",
    avatar: getUserInitials(user?.name || "User"),
    color: "bg-notion-accent"
  }

  const priorities = [
    { value: "low", label: "Low", color: "text-green-600", bg: "bg-green-100" },
    { value: "medium", label: "Medium", color: "text-yellow-600", bg: "bg-yellow-100" },
    { value: "high", label: "High", color: "text-red-600", bg: "bg-red-100" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-notion-border bg-white">
        <div clasppsName="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-notion-text">Tasks</h2>
            <div className="flex items-center gap-2 text-sm text-notion-text-secondary">
              <span>{pendingCount} pending</span>
              <span>•</span>
              <span>{completedCount} completed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            {/* <button className="btn-ghost btn-sm">
              <MoreHorizontal className="h-4 w-4" />
            </button> */}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-tertiary" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter("all")}
              className={`btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`btn-sm ${filter === "pending" ? "btn-primary" : "btn-ghost"}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`btn-sm ${filter === "completed" ? "btn-primary" : "btn-ghost"}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Add Task */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add a new task..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !editingId) {
                  handleCreateTodo()
                }
                if (e.key === "Enter" && editingId) {
                  handleSaveEdit()
                }
              }}
              className="input"
            />
          </div>
          {editingId ? (
            <div className="flex items-center gap-2">
              <button onClick={handleSaveEdit} disabled={loading} className="btn-primary btn-sm">
                <Save className="h-3 w-3 mr-1" />
                {loading ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancelEdit} className="btn-secondary btn-sm">
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button onClick={handleCreateTodo} disabled={loading} className="btn-primary">
              <Plus className="h-4 w-4 mr-1" />
              {loading ? "Adding..." : "Add"}
            </button>
          )}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="flex-1 overflow-hidden">
        {/* Table Header */}
        <div className="table-header grid grid-cols-12 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1"></div>
        </div>

        {/* Tasks List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredTodos.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                <Check className="empty-state-icon" />
                <h3 className="empty-state-title">No tasks found</h3>
                <p className="empty-state-description">Create your first task to get started</p>
              </motion.div>
            ) : (
              filteredTodos.map((todo, index) => {
                const assignee = currentUser
                const priority = priorities[Math.floor(Math.random() * priorities.length)]

                return (
                  <motion.div
                    key={todo._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="table-cell grid grid-cols-12 gap-4 items-center hover:bg-gray-25 group"
                  >
                    <div className="col-span-1">
                      <button
                        onClick={() => handleUpdateTodo(todo._id, { isCompleted: !todo.isCompleted })}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          todo.isCompleted
                            ? "bg-notion-accent border-notion-accent text-white"
                            : "border-gray-300 hover:border-notion-accent"
                        }`}
                      >
                        {todo.isCompleted && <Check className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="col-span-5">
                      <span
                        className={`text-sm ${
                          todo.isCompleted ? "line-through text-notion-text-secondary" : "text-notion-text"
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 ${assignee.color} rounded-full flex items-center justify-center text-xs font-medium text-white`}
                        >
                          {assignee.avatar}
                        </div>
                        <span className="text-sm text-notion-text-secondary">{assignee.username}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1 text-sm text-notion-text-secondary">
                        <Calendar className="h-3 w-3" />
                        {new Date(todo.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className={`tag ${priority.bg} ${priority.color} text-xs`}>{priority.label}</span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleEditTodo(todo)} className="btn-icon">
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="btn-icon text-notion-danger hover:bg-notion-danger-light"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Todos
