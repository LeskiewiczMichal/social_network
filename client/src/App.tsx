import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Pages from './pages';
import { useAppSelector } from './hooks';

function App() {
  const userLogged = useAppSelector((state) => state.user.id);

  return (
    <BrowserRouter>
      <Routes>
        {userLogged ? (
          <Route path="/" element={<Pages.Home />} />
        ) : (
          <Route path="/" element={<Pages.Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
