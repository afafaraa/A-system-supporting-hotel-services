import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import './theme/index.css'
import {Provider} from 'react-redux';
import {store} from './redux/store.ts';
import './locales/i18n';
import ThemedApp from "./ThemedApp.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </StrictMode>,
)
