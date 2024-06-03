import { useRouter } from 'next/router';
import GameBoard from '../../../components/GameBoard';
import Chat from '../../../components/Chat';

const Room: React.FC = () => {
  const router = useRouter();
  const { room } = router.query;

  return (
    <div>
      <h1>Room: {room}</h1>
      <GameBoard />
      <Chat room={room as string} />
    </div>
  );
};

export default Room;