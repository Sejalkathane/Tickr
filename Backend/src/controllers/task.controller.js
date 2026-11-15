const taskModel = require("../models/task.model");

exports.createTask = async (req, res) => {
  try {
    const task = await taskModel.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await taskModel
      .find({ userId: req.user.id })
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// show task acc to select
exports.getTodayTasks = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const tasks = await taskModel
      .find({
        userId: req.user.id,
        dueDate: { $gte: start, $lte: end },
      }) // $gte means “greater than or equal” and $lte means “less than or equal”.
      .sort({ dueDate: 1 }); //puts the earliest reminder first (1 = oldest to newest).

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { userId, ...updates } = req.body;

    const task = await taskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true },
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark a task as done
exports.markDone = async (req, res) => {
  try {
    const task = await taskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: "done", completedAt: new Date() },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Snooze a task (only your own)
exports.snoozeTask = async (req, res) => {
  try {
    // minutes can be sent in the body, default is 10
    const minutes = Number(req.body.minutes) || 10;

    const newDueDate = new Date(Date.now() + minutes * 60 * 1000);

    const task = await taskModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { dueDate: newDueDate, reminderSent: false },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};