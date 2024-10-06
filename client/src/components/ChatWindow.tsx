import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageSquare, Facebook, Send, User } from "lucide-react";
import { io, Socket } from "socket.io-client"; // Import the required type

// Define the props interface for ChatWindow
interface ChatWindowProps {
  whatsappSocket: Socket; // Type the `whatsappSocket` prop as `Socket`
}

// Mock data types
type UserType = {
  id: number;
  name: string;
  lastMessage: string;
};

type ChatType = {
  id: number;
  sender: string;
  message: string;
};

// Mock data
const mockUsers: Record<string, UserType[]> = {
  whatsapp: [
    { id: 1, name: "Alice", lastMessage: "Hey there!" },
    { id: 2, name: "Bob", lastMessage: "How are you?" },
    { id: 3, name: "Charlie", lastMessage: "See you soon!" },
  ],
  facebook: [
    { id: 4, name: "David", lastMessage: "What's up?" },
    { id: 5, name: "Eve", lastMessage: "Nice to meet you!" },
    { id: 6, name: "Frank", lastMessage: "Looking forward to it!" },
  ],
};

const mockChats: Record<number, ChatType[]> = {
  1: [
    { id: 1, sender: "Alice", message: "Hey there!" },
    { id: 2, sender: "You", message: "Hi Alice! How are you?" },
  ],
  2: [
    { id: 1, sender: "Bob", message: "How are you?" },
    { id: 2, sender: "You", message: "I'm good, thanks! How about you?" },
  ],
  3: [
    { id: 1, sender: "Charlie", message: "See you soon!" },
    { id: 2, sender: "You", message: "Looking forward to it!" },
  ],
  4: [
    { id: 1, sender: "David", message: "What's up?" },
    { id: 2, sender: "You", message: "Not much, just chilling." },
  ],
  5: [
    { id: 1, sender: "Eve", message: "Nice to meet you!" },
    { id: 2, sender: "You", message: "Nice to meet you too!" },
  ],
  6: [
    { id: 1, sender: "Frank", message: "Looking forward to it!" },
    { id: 2, sender: "You", message: "Me too! It's going to be great." },
  ],
};

// Update ChatWindow to accept props
const ChatWindow: React.FC<ChatWindowProps> = ({ whatsappSocket }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    "whatsapp" | "facebook"
  >("whatsapp");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() && activeChat) {
      whatsappSocket.emit("sendMessageToRoom", {
        chatId: activeChat,
        content: message,
      });
      setMessage("");
    }
  };

  const joinRoom = (id: Number) => {
    console.log("Inside Join room function");
    console.log("user ID: ", id);
    whatsappSocket.emit("registerRoom", id);
  };

  useEffect(() => {
    mockUsers[selectedPlatform]?.forEach((user) => {
      joinRoom(user.id);
    });
  }, [selectedPlatform]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Icon Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <Button
          variant={selectedPlatform === "whatsapp" ? "default" : "ghost"}
          size="icon"
          onClick={() => setSelectedPlatform("whatsapp")}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
        <Button
          variant={selectedPlatform === "facebook" ? "default" : "ghost"}
          size="icon"
          onClick={() => setSelectedPlatform("facebook")}
        >
          <Facebook className="h-6 w-6" />
        </Button>
      </div>

      {/* User List */}
      <div className="w-64 bg-white border-r">
        <h2 className="text-xl font-semibold p-4">
          {selectedPlatform === "whatsapp" ? "WhatsApp" : "Facebook"} Chats
        </h2>
        <ScrollArea className="h-[calc(100vh-60px)]">
          {mockUsers[selectedPlatform]?.map((user: UserType) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setActiveChat(user.id);
              }}
            >
              <User className="h-6 w-6 mr-2" />
              <div className="text-left">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {user.lastMessage}
                </div>
              </div>
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            <div className="bg-white p-4 shadow">
              <h3 className="text-lg font-semibold">
                {
                  mockUsers[selectedPlatform].find(
                    (u: UserType) => u.id === activeChat
                  )?.name
                }
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              {mockChats[activeChat]?.map((chat: ChatType) => (
                <div
                  key={chat.id}
                  className={`mb-4 ${
                    chat.sender === "You" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      chat.sender === "You"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {chat.message}
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
