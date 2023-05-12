import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Pages from './pages';
import { useAppSelector } from './hooks';

function App() {
  const userLogged = useAppSelector((state) => state.user.id);

  return (
    <BrowserRouter>
      {userLogged ? (
        <Routes>
          <Route path="/" element={<Pages.Home />} />
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
