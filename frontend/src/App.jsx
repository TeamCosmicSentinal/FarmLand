import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthRoutes from './components/AuthRoutes';
import ProtectedRoutes from './components/ProtectedRoutes';
import { useAuth } from './components/AuthContext';

function App() {
  const { token } = useAuth();
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
        <Navbar />
        <main className="flex-1 pt-20 pb-16">
          <div className="container-custom">
            {token ? <ProtectedRoutes /> : <AuthRoutes />}
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
