import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";

// **PWA SERVICE WORKER REGISTRATION**
// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('✅ SW registered: ', registration);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available, refresh page
                console.log('🔄 New content available, refreshing...');
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('❌ SW registration failed: ', error);
      });
  });
}

// **ACCESSIBILITY ENHANCEMENT**
// Add axe-core for development accessibility testing
if (import.meta.env.DEV) {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
    console.log('🔍 Accessibility testing enabled in development');
  }).catch(() => {
    console.log('Accessibility testing not available');
  });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
