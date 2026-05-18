const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require("./app");
const cors = require("cors");
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`is working fine ${PORT}`);
})