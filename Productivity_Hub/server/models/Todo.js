import mongoose from "mongoose"

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Task text is required"],
      trim: true,
      maxlength: [500, "Task text cannot exceed 500 characters"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
todoSchema.index({ user: 1, isCompleted: 1, createdAt: -1 })
todoSchema.index({ user: 1, dueDate: 1 })

// Set completedAt when marking as completed
todoSchema.pre("save", function (next) {
  if (this.isModified("isCompleted")) {
    if (this.isCompleted && !this.completedAt) {
      this.completedAt = new Date()
    } else if (!this.isCompleted) {
      this.completedAt = null
    }
  }
  next()
})

export default mongoose.model("Todo", todoSchema)
