import React from 'react';
import { createRoot, Container } from 'react-dom/client';
import App from './App.tsx';import eruda from 'eruda';

eruda.init();

const container = document.getElementById('root') as Container;
const root = createRoot(container);

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);