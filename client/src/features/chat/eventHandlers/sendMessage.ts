import { Socket } from 'socket.io-client';

interface SendMessageProps {
  socket: Socket;
  body: string;
  receiverId: string;
}

const sendMessage = (props: SendMessageProps) => {
  const { socket, body, receiverId } = props;

  socket.timeout(5000).emit('send-message', { body, receiverId });
};

export default sendMessage;
