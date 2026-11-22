const { Server } = require("socket.io");
const userModel = require("./models/UserModel");
const captainModel = require("./models/CaptianModel");
const rideModel = require("./models/rideModel");

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
                const { captainId, rideId, location } = data;

                if (!captainId || !rideId || !location ||
                    location.lat == null || location.lng == null) {
                    return socket.emit("error", {
                        message: "Invalid location data",
                    });
                }

                // 1. Update captain location in MongoDB
                await captainModel.findByIdAndUpdate(captainId, {
                    location: {
                        type: "Point",
                        coordinates: [location.lng, location.lat],
                    },
                });

                // 2. Find captain's accepted or ongoing ride
                const activeRide = await rideModel.findOne({
                    _id: rideId,
                    captainId,
                    status: { $in: ["accepted", "ongoing"] },
                }).select("userId captainId status");

                // 3. Send location only to the assigned passenger
                if (activeRide) {
                    const passenger = await userModel
                        .findById(activeRide.userId)
                        .select("socketId");
                    console.log("Active ride found:", activeRide._id);
                    console.log("Passenger socket ID:", passenger?.socketId);

                    if (passenger?.socketId) {
                        io.to(passenger.socketId).emit("captain-location-updated", {
                            rideId: activeRide._id,
                            captainId,
                            location: {
                                lat: Number(location.lat),
                                lng: Number(location.lng),
                            },
                        });
                    }

                    else {
                        console.log("Passenger socket not connected or socketId missing");
                    }
                }

                console.log("Captain location updated:", location);
            } catch (err) {
                console.error("Captain location update error:", err);

                socket.emit("error", {
                    message: "Failed to update location",
                });
            }
        });


        socket.on("update-location-user", async (data) => {
    try {
        const { userId, rideId, location } = data;

        if (
            !userId ||
            !rideId ||
            !location ||
            location.lat == null ||
            location.lng == null
        ) {
            return socket.emit("error", {
                message: "Invalid passenger location data",
            });
        }

        // Verify that this passenger belongs to this active ride
        const activeRide = await rideModel.findOne({
            _id: rideId,
            userId,
            status: { $in: ["accepted", "ongoing"] },
        }).select("userId captainId status");

        if (!activeRide) {
            return;
        }

        // Find the assigned captain
        const captain = await captainModel
            .findById(activeRide.captainId)
            .select("socketId");

        if (captain?.socketId) {
            io.to(captain.socketId).emit("user-location-updated", {
                rideId: activeRide._id,
                userId,
                location: {
                    lat: Number(location.lat),
                    lng: Number(location.lng),
                },
            });

            console.log("Passenger location sent to captain:", location);
        }

    } catch (err) {
        console.error("Passenger location update error:", err);

        socket.emit("error", {
            message: "Failed to update passenger location",
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