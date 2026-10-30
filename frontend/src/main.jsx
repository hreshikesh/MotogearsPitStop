import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { initAnalytics } from '@/utils/analytics';
import { initMetaPixel } from '@/utils/metaPixel';

initAnalytics();
initMetaPixel();

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);