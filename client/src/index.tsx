import React from 'react';
import ReactDOM from 'react-dom/client';
import en from 'javascript-time-ago/locale/en.json';
import TimeAgo from 'javascript-time-ago';

import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store/store';

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
