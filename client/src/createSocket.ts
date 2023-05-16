import { io, Socket } from 'socket.io-client';

const URL = process.env.REACT_APP_SERVER_URL;

const createSocket = (): Socket => {
  const token = localStorage.getItem('social_network_token');

  if (!URL) {
    throw new Error('No url in websockets');
  }

  const socket = io(URL, {
    reconnectionDelayMax: 10000,
    auth: {
      token,
    },
  });

  return socket;
};

export default createSocket;
