const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("hii");
});
module.exports = app;