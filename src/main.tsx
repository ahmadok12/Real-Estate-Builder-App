import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

function mount() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      const el = document.getElementById('root');
      if (el) {
        createRoot(el).render(
          <StrictMode>
            <App />
          </StrictMode>
        );
      }
    });
  }
}

mount();
