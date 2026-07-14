// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App as AntApp } from 'antd';

import { bootstrapGraphQLRuntime } from '@/app/bootstrap';
import { AuthProvider } from '@/features/auth';
import { GraphQLProvider, ThemeProvider } from '@/app/providers';
import { App } from '@/app/router';

import './index.css';

bootstrapGraphQLRuntime();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GraphQLProvider>
      <ThemeProvider>
        <AntApp>
          <AuthProvider>
            <App />
          </AuthProvider>
        </AntApp>
      </ThemeProvider>
    </GraphQLProvider>
  </React.StrictMode>,
);
