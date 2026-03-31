/**
 * Title: 
 * Description: 
 * Author: MD Khaled Masud Hamim
 * Date: 30/03/2026
 */

// dependencies
const express = require('express');
require('dotenv').config();
const { connectDB } = require('./src/config/db');
const app = express()
const port = process.env.port || 3000;
const leadRoutes = require('./src/routes/leads.routes')

// middleware
app.use(express.json());

// test route 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/leads', leadRoutes)

// start the server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch {
    console.error('Failed to start server:');
    process.exit(1); // stop app if DB fails
  }
}

startServer();
