const express = require("express");
const mongoose = require('mongoose');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser')
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(require("./routes/record"));
// require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3000;

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Server running on port ${port}`))



// get driver connection
// const dbo = require("./db/conn");
 
// app.listen(port, () => {
//   // perform a database connection when server starts
//   dbo.connectToServer(function (err) {
//     if (err) console.error(err);
 
//   });
//   console.log(`Server is running on port: ${port}`);
// });