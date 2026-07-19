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
const mapRoutes = require("./Routes/map.routes");
const rideRoutes = require("./Routes/rideRoutes");

connecttoDB();

const allowedOrigins = [
    "http://localhost:5173",
    "https://kcfkz06n-5173.inc1.devtunnels.ms"
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Welcome to the Uber API");
});

app.use("/users", userRoutes);
app.use("/captain", captainRoutes);
app.use("/auth", authRoutes);
app.use("/map", mapRoutes);
app.use("/ride", rideRoutes);

module.exports = app;