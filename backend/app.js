const express = require("express");
const app = express();
const connectDB = require("./db/db");
connectDB();


app.get("/", (req, res) => {
    res.send("hii");
});
module.exports = app;