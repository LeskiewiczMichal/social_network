import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import * as Pages from './pages';
import { useAppSelector, useAppDispatch } from './hooks';
import { autoLogin } from './features/authentication';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useAppDispatch();
  const userLogged = useAppSelector((state) => state.user.id);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  useEffect(() => {
    const handleAutoLogin = async () => {
      await dispatch(autoLogin());
      setIsLoading(false);
    };

    handleAutoLogin();
  }, [dispatch]);

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
