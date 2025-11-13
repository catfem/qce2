import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import { UserProvider } from './context/UserContext.jsx';
import { CreditProvider } from './context/CreditContext.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <CreditProvider>
            <App />
          </CreditProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
