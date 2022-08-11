import React from 'react';
import { createRoot } from 'react-dom/client';
import './sass/global.scss';
import { Provider } from 'react-redux';
import { store, persistor } from './app/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<p>Loading...</p>} persistor={persistor}>
        <Router>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);