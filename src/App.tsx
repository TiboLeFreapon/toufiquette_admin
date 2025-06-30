import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddEventPage from './pages/AddEventPage';
import EventList from './components/EventList';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { authService } from './services/authService';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, organizerProfile } = useAuth();
  const handleLogout = async () => {
    await authService.logout();
  };

  return (
    <div className="App">
      <nav className="nav">
        <div className="nav-content">
          <Link to="/" className="nav-title">Toufiquette Admin</Link>
          <div className="nav-links">
            <Link to="/events" className="nav-link">Événements</Link>
            {currentUser && <Link to="/add-event" className="nav-link">Ajouter un événement</Link>}
          </div>
          <div className="nav-links">
            {currentUser ? (
              <>
                <span className="text-white">Bonjour, {organizerProfile?.organizerName}</span>
                <button onClick={handleLogout} className="nav-link">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Connexion</Link>
                <Link to="/signup" className="nav-link">Inscription</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className="container py-8">
            <div className="home-content">
              <h2 className="home-title">
                Bienvenue dans l'administration Toufiquette
              </h2>
              <p className="home-description">
                Gérez vos événements facilement avec notre interface d'administration.
              </p>
              <div className="home-buttons">
                <Link to="/events" className="btn-secondary">
                  Voir les événements
                </Link>
                <Link to="/add-event" className="btn-primary">
                  Créer un nouvel événement
                </Link>
              </div>
            </div>
          </div>
        } />
        <Route path="/events" element={<EventList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/add-event" element={<AddEventPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
