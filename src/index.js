import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import './styles/tokens.css';
import './styles/base.css';
import './styles/utilities.css';
import App from './App';

const Splash = () => (
  <div
    style={{
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#101F2C',
    }}
    aria-label="Loading"
  />
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<Splash />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
