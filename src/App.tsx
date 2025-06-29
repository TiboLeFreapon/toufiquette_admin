import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddEventPage from './pages/AddEventPage';
import EventList from './components/EventList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav">
          <div className="nav-content">
            <h1 className="nav-title">Toufiquette Admin</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Accueil</Link>
              <Link to="/events" className="nav-link">Événements</Link>
              <Link to="/add-event" className="nav-link">Ajouter un événement</Link>
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
          <Route path="/events" element={
            <div className="page-bg py-8">
              <EventList />
            </div>
          } />
          <Route path="/add-event" element={<AddEventPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
