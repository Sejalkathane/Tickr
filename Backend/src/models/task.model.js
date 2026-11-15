const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
    },
    dueDate: {
      type: Date,
    },
    repeat: {
      type: String,
      enum: ["none", "daily", "weekly"],
      default: "none",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  // It tells Mongoose to automatically add two date fields to every task, so you don’t have to write them yourself.
  { timestamps: true },
  //     The Two Fields It Adds
  // Field	Meaning	            When it is set
  // createdAt	When the task was first created	Once, when you add the task
  // updatedAt	When the task was last changed	Every time you edit the task
);

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
