import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './index.css';
import ChromeOnly from './components/ChromeOnly.tsx';

function init() {
    if (!/Chrome|Chromium/.test(navigator.userAgent)) {
        createRoot(document.getElementById('root')!).render(
            <StrictMode>
                <ChromeOnly />
            </StrictMode>,
        );
        return;
    }
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>,
    );
}

init();