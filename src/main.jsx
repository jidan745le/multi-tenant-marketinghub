import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './assets/styles/fonts.css';
import './assets/styles/global.scss';
import i18n from './i18n/i18n';
import './index.css';
import store from './store';

// 在开发模式下暴露store到全局，方便调试
if (import.meta.env.DEV) {
  window.store = store;
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>
    <App />
    </I18nextProvider>
  </Provider>
);
