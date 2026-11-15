const nodemailer = require("nodemailer");

// Sender account (your Tickr Gmail from .env)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send a reminder email to one user
async function sendReminderEmail(toEmail, userName, task) {
  const dueText = new Date(task.dueDate).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });

  await transporter.sendMail({
    from: `"Tickr" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Reminder: ${task.title}`,
    text:
      `Hi ${userName},\n\n` +
      `This is your reminder for: ${task.title}\n` +
      `Due: ${dueText}\n` +
      `${task.note ? "Note: " + task.note + "\n" : ""}` +
      `\n- Tickr`
  });
}

module.exports = { sendReminderEmail };