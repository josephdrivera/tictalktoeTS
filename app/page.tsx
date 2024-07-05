'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoomId = Math.random().toString(36).substr(2, 9);
    router.push(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <div>
      <h1>Welcome to TicTalkToe</h1>
      <p>
        TicTalkToe is a multiplayer Tic Tac Toe game with a real-time chat feature.
        Create or join a game room to start playing!
      </p>
      <div>
        <button onClick={createRoom}>Create New Room</button>
      </div>
      <div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}