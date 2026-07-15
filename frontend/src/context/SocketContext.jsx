import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { createContext } from "react";


export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_BASEURL, {
    transports: ["websocket"],
    withCredentials: true,
});

const SocketProvider = ({ children }) => {
    useEffect(() => {
        const onConnect = () => console.log("Connected to socket server");
        const onDisconnect = () => console.log("Disconnected from socket server");

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const sendMessage = (eventName, message) => {
        socket.emit(eventName, message);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);

        return () => {
            socket.off(eventName, callback);
        };
    };

    return (
        <SocketContext.Provider value={{
            socket,
            sendMessage,
            receiveMessage
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;