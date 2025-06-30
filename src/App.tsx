import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddEventPage from './pages/AddEventPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import EventList from './components/EventList';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <nav className="nav">
              <div className="nav-content">
                <Link to="/" className="nav-title">Toufiquette Admin</Link>
                <div className="nav-links">
                  <AuthNav />
                </div>
              </div>
            </nav>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/events" element={<EventList />} />
                <Route path="/add-event" element={<AddEventPage />} />
                <Route path="/" element={<Navigate to="/events" />} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthNav: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <>
      {currentUser ? (
        <>
          <Link to="/events" className="nav-link">Événements</Link>
          <Link to="/add-event" className="nav-link">Ajouter un Événement</Link>
          <button onClick={handleLogout} className="nav-link logout">Déconnexion</button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-link">Connexion</Link>
          <Link to="/signup" className="nav-link">Inscription</Link>
        </>
      )}
    </>
  );
};

export default App;
