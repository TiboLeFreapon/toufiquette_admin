import React from 'react';
import EventForm from '../components/EventForm';

const AddEventPage: React.FC = () => {
  return (
    <div className="page-bg">
      {/* Header avec effet de verre */}
      <div className="page-header">
        <div className="container py-12">
          <div className="text-center">
            <h1 className="home-title">
              Créer un événement
            </h1>
            <p className="home-description">
              Partagez vos événements avec la communauté Toufiquette. Remplissez le formulaire ci-dessous pour créer un événement mémorable.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="page-content">
        <div className="max-w-4xl mx-auto">
          <EventForm />
        </div>
      </div>

      {/* Footer décoratif */}
      <div className="page-footer">
        <div className="footer-dots">
          <div className="dot blue"></div>
          <div className="dot purple"></div>
          <div className="dot indigo"></div>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage; 