const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");



router.post("/", authMiddleware.authUser, taskController.createTask);

router.get("/", authMiddleware.authUser, taskController.getTasks);

router.get("/today", authMiddleware.authUser, taskController.getTodayTasks);

router.put("/:id", authMiddleware.authUser, taskController.updateTask);

router.delete("/:id", authMiddleware.authUser, taskController.deleteTask);

router.patch("/:id/done", authMiddleware.authUser, taskController.markDone);

router.patch("/:id/snooze", authMiddleware.authUser, taskController.snoozeTask);

module.exports = router;
