import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './i18n'; // For bundling purpose

import App from './App';
import GlobalStyles from './components/GlobalStyles';
import LoadingIcon from './components/LoadingIcon';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingIcon defaultLoad />}>
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </React.Suspense>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
