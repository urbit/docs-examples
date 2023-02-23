import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import '@urbit/foundation-design-system/styles/globals.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app')
);
