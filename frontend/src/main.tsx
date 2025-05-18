import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import {store} from './redux/store.ts';
import App from './App.tsx';
import {createTheme, ThemeProvider} from "@mui/material";
import { deepOrange, amber } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: deepOrange,
    secondary: amber,
    background: {
      default: '#f0f0f0',
      paper: '#fff',
      main: deepOrange[100],
    },
    text: {
      primary: '#333',
      secondary: '#666',
      ternary: '#999'
    },
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        slotProps: {
          popper: { modifiers: [{name: 'offset', options: {offset: [0, -10]}}], },
        },
      },
    },
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
