import express from "express"
import Todo from "../models/Todo.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all todos for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, completed, search, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = { user: req.user._id }

    // Filter by completion status
    if (completed !== undefined) {
      query.isCompleted = completed === "true"
    }

    // Add search functionality
    if (search) {
      query.text = { $regex: search, $options: "i" }
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const todos = await Todo.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    res.json(todos)
  } catch (error) {
    console.error("Get todos error:", error)
    res.status(500).json({ message: "Server error while fetching todos" })
  }
})

// Create a new todo
router.post("/", auth, async (req, res) => {
  try {
    const { text, priority, dueDate, category } = req.body

    if (!text) {
      return res.status(400).json({
        message: "Task text is required",
      })
    }

    const todo = new Todo({
      text: text.trim(),
      user: req.user._id,
      priority: priority || "medium",
      dueDate: dueDate || null,
      category: category || null,
    })

    await todo.save()
    res.status(201).json(todo)
  } catch (error) {
    console.error("Create todo error:", error)
    res.status(500).json({ message: "Server error while creating todo" })
  }
})

// Update a todo
router.put("/:id", auth, async (req, res) => {
  try {
    const { text, isCompleted, priority, dueDate, category } = req.body

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    if (text !== undefined) todo.text = text.trim()
    if (isCompleted !== undefined) todo.isCompleted = isCompleted
    if (priority !== undefined) todo.priority = priority
    if (dueDate !== undefined) todo.dueDate = dueDate
    if (category !== undefined) todo.category = category

    await todo.save()
    res.json(todo)
  } catch (error) {
    console.error("Update todo error:", error)
    res.status(500).json({ message: "Server error while updating todo" })
  }
})

// Delete a todo
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" })
    }

    res.json({ message: "Todo deleted successfully" })
  } catch (error) {
    console.error("Delete todo error:", error)
    res.status(500).json({ message: "Server error while deleting todo" })
  }
})

export default router
