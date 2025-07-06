import express from "express"
import Note from "../models/Note.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all notes for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = { user: req.user._id }

    // Add search functionality
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const notes = await Note.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    res.json(notes)
  } catch (error) {
    console.error("Get notes error:", error)
    res.status(500).json({ message: "Server error while fetching notes" })
  }
})

// Create a new note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      })
    }

    const note = new Note({
      title: title.trim(),
      content: content.trim(),
      user: req.user._id,
      tags: tags || [],
      isPinned: isPinned || false,
    })

    await note.save()
    res.status(201).json(note)
  } catch (error) {
    console.error("Create note error:", error)
    res.status(500).json({ message: "Server error while creating note" })
  }
})

// Update a note
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body

    // if (!title || !content) {
    //   return res.status(400).json({
    //     message: "Title and content are required",
    //   })
    // }

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    note.title = title.trim()
    note.content = content.trim()
    if (tags !== undefined) note.tags = tags
    if (isPinned !== undefined) note.isPinned = isPinned

    await note.save()
    res.json(note)
  } catch (error) {
    console.error("Update note error:", error)
    res.status(500).json({ message: "Server error while updating note" })
  }
})

// Delete a note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    res.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Delete note error:", error)
    res.status(500).json({ message: "Server error while deleting note" })
  }
})

export default router
