const { Server } = require("socket.io");
const userModel = require("./models/UserModel");
const captainModel = require("./models/CaptianModel");

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        }
    });

    io.on("connection", (socket) => {
        console.log(`socket connected: ${socket.id}`);

        socket.on("joinRoom", async (data) => {
            const { userId, userType } = data;

            if (userType === "user") {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === "captain") {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

    socket.on("update-location-captain", async (data) => {
    try {

        const { captainId, location } = data;

        if (
            !location ||
            location.lat == null ||
            location.lng == null
        ) {
            return socket.emit("error", {
                message: "Invalid location data"
            });
        }

        await captainModel.findByIdAndUpdate(captainId, {
           location: {
           type: "Point",
           coordinates: [location.lng, location.lat]
}

        });
         console.log(`Updated location for captain ${captainId}:`, location);

    } catch (err) {

        console.error(err);

        socket.emit("error", {
            message: "Failed to update location"
        });

    }
});


        socket.on("disconnect", () => {
            console.log(`socket disconnected: ${socket.id}`);
        });
    });

    
}

function sendMessageToSocketID(socketId, eventName, data) {
    if (!io) {
        throw new Error("Socket server has not been initialized yet.");
    }

    io.to(socketId).emit(eventName, data);
}

module.exports = {
    initializeSocket,
    sendMessageToSocketID
};