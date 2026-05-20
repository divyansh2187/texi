const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const app = express();

const connecttoDB = require('./db/db');
const userRoutes = require('./Routes/user.routes');
const cookieParser = require('cookie-parser');
const captainRoutes = require('./Routes/captain.routes');
const authRoutes = require("./Routes/authRoutes");

connecttoDB();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to the Uber API");
});

app.use("/users", userRoutes);
app.use("/captain", captainRoutes);
app.use("/auth", authRoutes);

module.exports = app;