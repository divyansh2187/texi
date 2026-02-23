const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connecttoDB = require('./db/db');
const userRoutes = require('./Routes/user.routes');

connecttoDB();

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);



app.get('/', (req, res) => {
    res.send("Welcome to the Uber API");
});

app.use("/users", userRoutes);


module.exports = app;