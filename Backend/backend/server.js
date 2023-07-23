const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const cors = require("cors");
const port = 3000;

//connection to DB
connectDB();

const app = express();

// Middlezare: processes the data from the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/post", require("./routes/post.routes"));
app.use("/user", require("./routes/user.routes"));

// Start server
app.listen(port, () => console.log("Server to start at port: " + port));