import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/index.css'
import { Provider } from 'react-redux';
import {store} from './redux/store.ts';
import App from './App.tsx';
import {ThemeProvider} from "@mui/material";
import {lightTheme} from './theme/theme.ts';
import './locales/i18n';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
