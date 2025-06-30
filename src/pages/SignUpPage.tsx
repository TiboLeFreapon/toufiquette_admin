import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService, organizerService } from '../services/authService';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await authService.signUp(authService.auth, email, password);
      const uid = userCredential.user.uid;
      
      await organizerService.createProfile(uid, {
        organizerName,
        email,
        address,
        latitude: 0, // Vous pourriez intégrer une API de géocodage ici
        longitude: 0,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center py-12">
      <div className="card w-full max-w-md">
        <div className="card-content">
          <div className="section-header">
            <h2 className="section-title">Inscription Organisateur</h2>
          </div>
          {error && <div className="message error">{error}</div>}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="form-label" htmlFor="organizerName">Nom de l'organisme</label>
              <input
                id="organizerName"
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="form-label" htmlFor="address">Adresse par défaut</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              S'inscrire
            </button>
          </form>
          <p className="text-center mt-4">
            Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 