import ChatWindow from "./components/ChatWindow";
import { io, Socket } from "socket.io-client";

function App() {
  let whatsappSocket: Socket = io("http://localhost:3000/whatsapp");

  return (
    <>
      <ChatWindow whatsappSocket={whatsappSocket} />
    </>
  );
}

export default App;
