import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [10000, "Content cannot exceed 10000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
noteSchema.index({ user: 1, createdAt: -1 })
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 })

// Update lastModified on save
noteSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date()
  }
  next()
})

export default mongoose.model("Note", noteSchema)
