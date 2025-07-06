"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import toast from "react-hot-toast"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit3,
  Trash2,
  Calendar,
  FileText,
  Hash,
  X,
  Save,
  Filter,
  SortAsc,
} from "lucide-react"

function Notes() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await axios.get("/api/notes")
      setNotes(response.data)
    } catch (error) {
      toast.error("Failed to fetch notes")
      console.error("Error fetching notes:", error)
    }
  }

  const handleCreateNote = () => {
    setSelectedNote(null)
    setTitle("")
    setContent("")
    setIsEditing(true)
  }

  const handleSelectNote = (note) => {
    if (isEditing) return
    setSelectedNote(note)
    setTitle(note.title)
    setContent(note.content)
    setIsEditing(false)
  }

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) { //agar kuchh bhi dala nii h title or content mai toh yai chaelga

      toast.error("Please fill in all fields") // red color mai error pop hoga
      return
    }

    setLoading(true)
    try {
      if (selectedNote) {
        await axios.put(`/api/notes/${selectedNote._id}`, { title, content })
        toast.success("Note updated successfully!")
      } else {
        await axios.post("/api/notes", { title, content })
        toast.success("Note created successfully!")
      }

      setIsEditing(false)
      fetchNotes()
    } catch (error) {
      toast.error("Failed to save note")
      console.error("Error saving note:", error)
    }
    setLoading(false)
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`/api/notes/${noteId}`)
        toast.success("Note deleted successfully!")
        if (selectedNote && selectedNote._id === noteId) {
          setSelectedNote(null)
          setTitle("")
          setContent("")
          setIsEditing(false)
        }
        fetchNotes() // jo apane update kiya h notes ko vo show karega baaju mai list mai

      } catch (error) {
        toast.error("Failed to delete note")
        console.error("Error deleting note:", error)
      }
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-80 border-r border-notion-border bg-gray-25 flex flex-col">
        {/* List Header */}
        <div className="p-4 border-b border-notion-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-notion-text">All Notes</h2>
            <div className="flex items-center gap-1">
              <button className="btn-icon">
                <Filter className="h-4 w-4" />
              </button>
              <button className="btn-icon">
                <SortAsc className="h-4 w-4" />
              </button>
              <button onClick={handleCreateNote} className="btn-primary btn-sm">
                <Plus className="h-3 w-3 mr-1" />
                New
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-tertiary" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-9 text-sm"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredNotes.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                <FileText className="empty-state-icon" />
                <h3 className="empty-state-title">No notes found</h3>
                <p className="empty-state-description">Create your first note to get started</p>
              </motion.div>
            ) : (
              filteredNotes.map((note, index) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectNote(note)}
                  className={`p-4 border-b border-notion-border cursor-pointer hover:bg-white transition-colors ${
                    selectedNote && selectedNote._id === note._id ? "bg-white border-l-4 border-l-notion-accent" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-notion-text text-sm line-clamp-1">{note.title}</h3>
                    <div className="flex bg items-center gap-1 opacity-1 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNote(note._id)
                        }}
                        className="btn-icon "
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-notion-text-secondary text-xs line-clamp-2 mb-2">{note.content}</p>
                  <div className="flex items-center text-notion-text-tertiary text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col">
        {selectedNote || isEditing ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-notion-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <span className="tag tag-blue">Editing</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        if (selectedNote) {
                          setTitle(selectedNote.title)
                          setContent(selectedNote.content)
                        } else {
                          setSelectedNote(null)
                          setTitle("")
                          setContent("")
                        }
                      }}
                      className="btn-secondary btn-sm"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </button>
                    <button onClick={handleSaveNote} disabled={loading} className="btn-primary btn-sm">
                      <Save className="h-3 w-3 mr-1" />
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm">
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button className="btn-icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Untitled"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-notion-text-tertiary text-notion-text"
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <Hash className="h-4 w-4 text-notion-text-tertiary" />
                    <span className="tag tag-blue">ideas</span>
                    <span className="tag tag-green">productivity</span>
                    <span className="tag tag-yellow">work</span>
                  </div>
                  <textarea
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-96 bg-transparent border-none outline-none resize-none placeholder-notion-text-tertiary text-notion-text leading-relaxed"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold text-notion-text">{selectedNote?.title}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Hash className="h-4 w-4 text-notion-text-tertiary" />
                    <span className="tag tag-blue">ideas</span>
                    <span className="tag tag-green">productivity</span>
                    <span className="tag tag-yellow">work</span>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-notion-text leading-relaxed whitespace-pre-wrap">{selectedNote?.content}</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-notion-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-notion-text mb-2">Select a note to view</h3>
              <p className="text-notion-text-secondary mb-4">Choose a note from the sidebar or create a new one</p>
              <button onClick={handleCreateNote} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create New Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notes
