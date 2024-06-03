'use client'; // This file is a client component

import { useParams } from 'next/navigation';
import GameBoard from '../../../components/GameBoard';
import Chat from '../../../components/Chat';

const Room: React.FC = () => {
  const { room } = useParams();

  return (
    <div>
      <h1>Room: {room}</h1>
      <GameBoard />
      <Chat room={room as string} />
    </div>
  );
};

export default Room;