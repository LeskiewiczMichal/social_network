import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import createSocket from './createSocket';
import * as Pages from './pages';
import { useAppDispatch } from './hooks';
import { autoLogin, SocketProvider } from './features/authentication';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './features/header';

function App() {
  const dispatch = useAppDispatch();
  // const userLogged = useAppSelector((state) => state.user.id);
  const userLogged = true;
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  let socket: Socket | null = null;

  // Auto login
  useEffect(() => {
    const handleAutoLogin = async () => {
      await dispatch(autoLogin());
      setIsLoading(false);
    };

    handleAutoLogin();
  }, [dispatch]);

  if (userLogged) {
    socket = createSocket();
  }

  // Socket.io connection
  useEffect(() => {
    if (socket && userLogged) {
      socket.on('connect', () => {
        console.log('POLACZONE');
      });
      socket.on('disconnect', () => {
        console.log('DISCONNECTED');
      });
    }

    if (!userLogged) {
      socket?.disconnect();
    }
  }, [userLogged, socket]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SocketProvider socket={socket}>
      <BrowserRouter>
        {userLogged ? (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Pages.Home />} />
              {/* Tymczasowo */}
              <Route path="/login" element={<Pages.Login />} />
              <Route path="/register" element={<Pages.Registration />} />{' '}
              <Route path="/profile/:userId" element={<Pages.Profile />} />
              <Route path="/profile" element={<Pages.Profile />} />
              <Route path="/chat/:userId" element={<Pages.Chat />} />
              <Route path="/chat" element={<Pages.ChatSelecion />} />
              {/* Tymczasowo */}
              {/* <button type="button" onClick={() => }>gowno</button> */}
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Pages.Login />} />
            <Route path="/register" element={<Pages.Registration />} />
          </Routes>
        )}
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;
