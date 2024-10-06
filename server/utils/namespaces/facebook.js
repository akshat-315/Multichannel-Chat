function facebookSocketConfig(io) {
  io.of("/facebook").on("connection", (socket) => {
    console.log(`New client connected to facebook service: ${socket.id}`);

    socket.on("message", (data) => {
      console.log("Message received from facebook client:", data);

      socket.emit("message", `Server received: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

export { facebookSocketConfig };
