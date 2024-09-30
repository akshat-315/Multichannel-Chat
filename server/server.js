import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
const port = 3000;

// Create HTTP server
const httpServer = http.createServer(app);

// Create a new instance of Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (Adjust this to limit specific origins)
    methods: ["GET", "POST"], // Allow specific methods
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Middleware to log every event
  socket.use((packet, next) => {
    console.log(
      `Received event: ${packet[0]} with data: ${JSON.stringify(packet[1])}`
    );
    next();
  });

  // Listen for incoming messages from the client
  socket.on("message", (data) => {
    console.log("Message received from client:", data);

    // Emit a response back to the client
    socket.emit("message", `Server received: ${data}`);
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Listen for all other events
  socket.onAny((event, ...args) => {
    console.log(`Event received: ${event} with args: ${JSON.stringify(args)}`);
  });
});

// Basic GET endpoint to test server
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start HTTP server and WebSocket server
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
