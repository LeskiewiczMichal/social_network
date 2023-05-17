import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import createSocket from './createSocket';
import * as Pages from './pages';
import { useAppDispatch } from './hooks';
import { autoLogin } from './features/authentication';
import LoadingSpinner from './components/LoadingSpinner';

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

  // Websockets connection
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('POLACZONE');
      });
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
    <BrowserRouter>
      {userLogged ? (
        <Routes>
          <Route path="/" element={<Pages.Home />} />
          {/* <button type="button" onClick={() => }>gowno</button> */}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Pages.Login />} />
          <Route path="/register" element={<Pages.Registration />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
