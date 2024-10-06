import { io } from "socket.io-client";

// Define the server URL and namespace
const serverUrl = "http://localhost:3000/whatsapp"; // Replace with the correct URL if different

// Create connections for Alice, Bob, and Charlie
const aliceSocket = io(serverUrl);
const bobSocket = io(serverUrl);
const charlieSocket = io(serverUrl);

// Chat IDs for each user
const users = {
  alice: { socket: aliceSocket, chatId: "alice123" },
  bob: { socket: bobSocket, chatId: "bob456" },
  charlie: { socket: charlieSocket, chatId: "charlie789" },
};

// Register each user in the respective room based on chatId
Object.keys(users).forEach((user) => {
  const { socket, chatId } = users[user];

  // Register to the WhatsApp namespace and join their respective room
  socket.on("connect", () => {
    console.log(`${user} connected with ID: ${socket.id}`);
    socket.emit("registerChat", chatId);
  });

  // Listen for any message from the server
  socket.on("message", (message) => {
    console.log(`Message received by ${user}: ${message}`);
  });

  // Log disconnection events
  socket.on("disconnect", () => {
    console.log(`${user} disconnected from the server.`);
  });
});

// Function to simulate sending messages at different intervals
function simulateMessages() {
  // Define messages to be sent by each user
  const messages = [
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
    { user: "alice", content: "Hello from Alice!" },
    { user: "bob", content: "Hey, it's Bob here!" },
    { user: "charlie", content: "Good day! Charlie here." },
    { user: "alice", content: "How's everyone doing?" },
    { user: "bob", content: "Let's grab a coffee sometime." },
    { user: "charlie", content: "Sure, I am in!" },
  ];

  // Emit each message to the server with a delay between them
  messages.forEach((msg, index) => {
    setTimeout(() => {
      const { socket, chatId } = users[msg.user];
      console.log(`Sending message from ${msg.user}: ${msg.content}`);
      socket.emit("message", { chatId, content: msg.content });
    }, index * 2);
  });
}

// Start sending messages
simulateMessages();
