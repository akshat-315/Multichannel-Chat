import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { facebookSocketConfig } from "./utils/namespaces/facebook.js";
import { whatsappSocketConfig } from "./utils/namespaces/whatsapp.js";

const app = express();
const port = 3000;

// Create HTTP server
const httpServer = http.createServer(app);

// Create a new instance of Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());

whatsappSocketConfig(io);
facebookSocketConfig(io);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
