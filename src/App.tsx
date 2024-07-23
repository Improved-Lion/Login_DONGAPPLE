import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import AppRoutes from './routes/routes';
import { AuthProvider } from './contexts/Auth';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
