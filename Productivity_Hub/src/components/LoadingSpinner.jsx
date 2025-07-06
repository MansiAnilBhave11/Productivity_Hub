"use client"

import { motion } from "framer-motion"

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-notion-accent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-notion-text-secondary text-sm">Loading your workspace...</p>
      </motion.div>
    </div>
  )
}

export default LoadingSpinner
