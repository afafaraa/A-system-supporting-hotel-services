import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import {store} from './redux/store.ts';
import App from './App.tsx';
import {ThemeProvider} from "@mui/material";
import theme from './theme.ts';
import './locales/i18n';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
