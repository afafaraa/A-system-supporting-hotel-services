import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/index.css'
import {Provider, useSelector} from 'react-redux';
import {store} from './redux/store.ts';
import App from './App.tsx';
import {ThemeProvider} from "@mui/material";
import {lightTheme} from './theme/light/theme.ts';
import './locales/i18n';
import {selectTheme} from "./redux/slices/themeSlice.ts";

function ThemedApp() {
  const mode = useSelector(selectTheme);
  const theme = mode.theme === 'light' ? lightTheme : lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </StrictMode>,
)
