const cron = require("node-cron");
const taskModel = require("../models/task.model");

function startScheduler() {
  // "* * * * *" means: run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find tasks that are due, still pending, and not reminded yet
      const dueTasks = await taskModel.find({
        status: "pending",
        reminderSent: false,
        dueDate: { $lte: now },
      });

      for (const task of dueTasks) {
        console.log(`REMINDER: "${task.title}" is due now`);

        if (task.repeat === "daily" || task.repeat === "weekly") {
          // Move to the next date
          const days = task.repeat === "daily" ? 1 : 7;
          const next = new Date(task.dueDate);

          // Keep adding days until the date is in the future
          // (needed if the server was off for a while)
          do {
            next.setDate(next.getDate() + days);
          } while (next <= now);

          task.dueDate = next;
          task.reminderSent = false;
        } else {
          // One-time task: mark as reminded
          task.reminderSent = true;
        }

        await task.save();
      }
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  });

  console.log("Scheduler started");
}

module.exports = startScheduler;

// cron.schedule("* * * * *", ...)	Runs the function every minute
// dueDate: { $lte: now }	Finds tasks whose time is now or already passed
// status: "pending"	Skips tasks you already finished
// reminderSent: false	Skips tasks already reminded
// task.reminderSent = true	Stops the same reminder from repeating every minute
