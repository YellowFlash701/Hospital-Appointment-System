/* eslint-disable no-unused-vars */
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import { compile } from "@fileforge/react-print";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
