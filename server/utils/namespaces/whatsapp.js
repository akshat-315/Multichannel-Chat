function whatsappSocketConfig(io) {
  io.of("/whatsapp").on("connection", (socket) => {
    console.log(`New client connected to whatsapp service: ${socket.id}`);

    socket.on("registerRoom", (chatId) => {
      console.log("Inside joinRoom in server");
      socket.join(chatId);
      console.log(`User with socket ID: ${socket.id} joined room: ${chatId}`);
    });

    // Handle incoming messages from clients
    socket.on("message", (data) => {
      const { chatId, content } = data;
      console.log("Data: ", data.chatId);
      console.log(
        `Message received from chatId: ${chatId}, Message: ${content}`
      );

      // Emit the message back to the respective room (user)
      socket
        .to(chatId)
        .emit("message", `New message from ${chatId}: ${content}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

export { whatsappSocketConfig };
