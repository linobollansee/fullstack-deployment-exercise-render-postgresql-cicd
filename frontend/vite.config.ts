// Import Vite configuration function
// Vite-Konfigurationsfunktion importieren
import { defineConfig } from "vite";

// Import React plugin for Vite
// React-Plugin für Vite importieren
import react from "@vitejs/plugin-react";

// Vite configuration - https://vite.dev/config/
// Vite-Konfiguration - https://vite.dev/config/
export default defineConfig({
  // plugins: Array of Vite plugins to use
  // plugins: Array von zu verwendenden Vite-Plugins
  plugins: [react()], // Enable React support / React-Unterstützung aktivieren
  
  // server: Development server configuration
  // server: Entwicklungsserver-Konfiguration
  server: {
    // proxy: Redirect API requests to backend during development
    // proxy: API-Anfragen während der Entwicklung an Backend weiterleiten
    proxy: {
      // Proxy for /quotes route
      // Proxy für /quotes-Route
      "/quotes": {
        target: "http://localhost:3000",  // Backend server URL / Backend-Server-URL
        changeOrigin: true,               // Change origin header / Origin-Header ändern
      },
      // Proxy for /users route
      // Proxy für /users-Route
      "/users": {
        target: "http://localhost:3000",  // Backend server URL / Backend-Server-URL
        changeOrigin: true,               // Change origin header / Origin-Header ändern
      },
    },
  },
});
