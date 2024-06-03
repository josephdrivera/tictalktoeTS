import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

interface ChatProps {
    room: string;
}

const Chat: React.FC<ChatProps> = ({ room }) => {
    const [messages, setMessages] = useState<string[]>([]);// Store the messages
    const [input, setInput] = useState<string>("");// Store the input
    const  socket = io();// Create a socket

    useEffect(() => {
        socket.emit("join", room);// Join the room

        socket.on("message", (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);// Add the message to the messages
        });

        return () => {
            socket.disconnect();// Disconnect from the socket
        };
    }
    , [room]);// Run this effect when the room changes

    const sendMessage = (): void =>{
        socket.emit("sendMessage", input);// Send the message
        setInput("");// Clear the input
    };

    return (
        <div>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      );
    };

export default Chat;