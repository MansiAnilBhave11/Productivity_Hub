"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import {
  StickyNote,
  CheckSquare,
  Search,
  Settings,
  User,
  ChevronDown,
  Plus,
  Home,
  Calendar,
  Archive,
  Trash2,
  Zap,
} from "lucide-react"
import Notes from "./Notes"
import Todos from "./Todos"

function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("notes")
  const [showUserMenu, setShowUserMenu] = useState(false)

  const sidebarItems = [
    { id: "home", label: "Home", icon: Home, active: false },
    { id: "notes", label: "Notes", icon: StickyNote, active: activeTab === "notes" },
    { id: "todos", label: "Tasks", icon: CheckSquare, active: activeTab === "todos" },
    // { id: "calendar", label: "Calendar", icon: Calendar, active: false },
    // { id: "archive", label: "Archive", icon: Archive, active: false },
    // { id: "trash", label: "Trash", icon: Trash2, active: false },
  ]

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-64 bg-gray-50 border-r border-notion-border flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-notion-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-notion-accent rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-notion-text">Productivity Hub</span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-notion-text-tertiary" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-notion-border rounded-md focus:outline-none focus:ring-1 focus:ring-notion-accent"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "notes" || item.id === "todos") {
                    setActiveTab(item.id)
                  }
                }}
                className={`sidebar-item w-full ${item.active ? "active" : ""}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="px-2 py-1 text-xs font-medium text-notion-text-tertiary uppercase tracking-wide">
              Quick Actions
            </div>
            <div className="mt-2 space-y-1">
              <button className="sidebar-item w-full">
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </button>
              <button className="sidebar-item w-full">
                <Plus className="h-4 w-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="p-2 border-t border-notion-border">
          <div className="relative">
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="sidebar-item w-full justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-notion-accent rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="truncate">{user?.name}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-notion-border rounded-md shadow-notion py-1"
              >
                <button className="w-full px-3 py-2 text-left text-sm text-notion-text hover:bg-gray-50 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full px-3 py-2 text-left text-sm text-notion-danger hover:bg-gray-50"
                >
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="page-header"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-notion-text">{activeTab === "notes" ? "Notes" : "Tasks"}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Page Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="page-content"
        >
          {activeTab === "notes" && <Notes />}
          {activeTab === "todos" && <Todos />}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
