import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Pages from './pages';
import { useAppSelector } from './hooks';

function App() {
  const userLogged = useAppSelector((state) => state.user.id);

  if (!userLogged) {
    return <Pages.Login />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pages.Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
