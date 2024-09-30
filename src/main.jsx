import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Scrollbar } from 'react-scrollbars-custom';
import App from './App.jsx'
import './index.css'
import { ScopedCssBaseline, ThemeProvider } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ThemeProvider > */}
      <ScopedCssBaseline enableColorScheme> 
        <App />
      </ScopedCssBaseline>
    {/* </ThemeProvider> */}
  </StrictMode>,
)
