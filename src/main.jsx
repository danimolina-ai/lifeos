import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App.jsx'
import './lib/storage' // Initialize storage wrapper

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
