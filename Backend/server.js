require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db')
const dns = require("node:dns");
const startScheduler = require("./src/services/scheduler");

dns.setServers(["8.8.8.8" , "8.8.4.4"])

connectDB();

startScheduler();
app.listen(3000,()=>{
    console.log("server is running on port 3000");
})

