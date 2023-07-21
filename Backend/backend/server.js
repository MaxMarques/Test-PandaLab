const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const port = 3000;

//connection to DB
connectDB();

const app = express();

// Middlezare: processes the data from the request
app.use(express.json());
app.use(express.urlencoded({ extrended: false }));

app.use("/post", require("./routes/post.routes"));

// Start server
app.listen(port, () => console.log("Server to start at port: " + port));