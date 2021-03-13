import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Notifications from './utils/notification'
import ErrorH from './utils/ErrorBoundary'
ReactDOM.render(
  <Notifications>
    <App />
  </Notifications>,
  document.getElementById('root')
);


