import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.login(authService.auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="page-bg flex items-center justify-center">
      <div className="card w-full max-w-md">
        <div className="card-content">
          <div className="section-header">
            <h2 className="section-title">Connexion</h2>
          </div>
          {error && <div className="message error">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-6">
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
            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
          <p className="text-center mt-4">
            Pas encore de compte ? <Link to="/signup" className="text-blue-600 hover:underline">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 