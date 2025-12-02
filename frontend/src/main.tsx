// Import StrictMode - enables additional development checks
// StrictMode importieren - aktiviert zusätzliche Entwicklungsprüfungen
import { StrictMode } from 'react'

// Import createRoot - React 18+ way to render the app
// createRoot importieren - React 18+ Methode zum Rendern der App
import { createRoot } from 'react-dom/client'

// Import global CSS styles
// Globale CSS-Styles importieren
import './index.css'

// Import main App component
// Haupt-App-Komponente importieren
import App from './App.tsx'

// Create React root and render the app
// React-Root erstellen und App rendern
createRoot(document.getElementById('root')!).render(
  // StrictMode wrapper - helps identify potential problems
  // StrictMode-Wrapper - hilft potenzielle Probleme zu identifizieren
  <StrictMode>
    {/* Render the main App component / Haupt-App-Komponente rendern */}
    <App />
  </StrictMode>,
)
