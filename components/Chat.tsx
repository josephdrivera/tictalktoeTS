import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface ChatProps {
    room: string;
}

const Chat: React.FC<ChatProps> = ({ room }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3000', { transports: ['websocket', 'polling', 'flashsocket'] });
        setSocket(newSocket);

        newSocket.emit('join', room);

        newSocket.on('message', (message: string) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [room]);

    const sendMessage = () => {
        if (socket) {
            socket.emit('sendMessage', input);
            setInput('');
        }
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
                placeholder="Enter your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;