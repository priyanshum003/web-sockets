import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    console.log(socket.id);

    socket.broadcast.emit("welcome",  `${socket.id} Joined the chat!`);
    
    socket.on("disconnect", () => {
        console.log("Disconnected from server");
    });

    socket.on("joinRoom", (groupName) => {
        console.log(groupName);
        socket.join(groupName);
    });

    socket.on("message", ({message, room}) => {
        console.log(message, room);
        io.to(room).emit("message", message);
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}
);