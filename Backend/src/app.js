const express = require('express');
const cookieParser = require('cookie-parser')
const taskRoutes = require("./routes/task.routes")
const authRoutes =require("./routes/auth.routes")

const app=express();


app.use(express.json());
app.use(cookieParser());


app.use('/api/tasks',taskRoutes)
app.use('/api/auth',authRoutes);

module.exports=app;