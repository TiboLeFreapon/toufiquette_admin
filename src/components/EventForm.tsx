import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { EventFormData, EVENT_CATEGORIES } from '../types/event';
import IconSelector from './IconSelector';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EventForm: React.FC = () => {
  const { organizerProfile, currentUser } = useAuth();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    address: organizerProfile?.address || '',
    latitude: organizerProfile?.latitude || 0,
    longitude: organizerProfile?.longitude || 0,
    category: 'Musique',
    tags: [],
    image: '🎵',
    eventStartTimestamp: null,
    eventEndTimestamp: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (organizerProfile) {
      setFormData(prev => ({
        ...prev,
        address: organizerProfile.address,
        latitude: organizerProfile.latitude,
        longitude: organizerProfile.longitude,
      }));
    }
  }, [organizerProfile]);
  
  if (!currentUser || !organizerProfile) {
    return <p>Chargement du profil...</p>; // Ou une redirection
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({
      ...prev,
      image: icon
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleStartDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, eventStartTimestamp: date }));
  };
  const handleEndDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, eventEndTimestamp: date }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      if (!currentUser || !organizerProfile) {
        throw new Error("Utilisateur non authentifié ou profil introuvable.");
      }
      if (!formData.title || !formData.description || !formData.address || !formData.eventStartTimestamp || !formData.eventEndTimestamp) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }
      if (formData.eventEndTimestamp < formData.eventStartTimestamp) {
        throw new Error('La date de fin doit être postérieure à la date de début');
      }
      const eventId = await eventService.addEvent(
        formData,
        currentUser.uid,
        organizerProfile.organizerName
      );
      setMessage({ type: 'success', text: `Événement créé avec succès! ID: ${eventId}` });
      setFormData({
        title: '',
        description: '',
        address: organizerProfile?.address || '',
        latitude: organizerProfile?.latitude || 0,
        longitude: organizerProfile?.longitude || 0,
        category: 'Musique',
        tags: [],
        image: '🎵',
        eventStartTimestamp: null,
        eventEndTimestamp: null,
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de l'événement" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        {message && (
          <div className={`message ${message.type}`}>
            <div className="flex items-center">
              <div className={`message-icon ${message.type}`}>
                {message.type === 'success' ? '✓' : '✕'}
              </div>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Informations principales */}
          <div className="space-y-6">
            <div className="section-header">
              <h3 className="section-title">Informations principales</h3>
              <div className="section-divider blue-purple"></div>
            </div>

            {/* Titre */}
            <div className="group">
              <label htmlFor="title" className="form-label">
                Titre de l'événement *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ex: Concert de jazz au centre-ville"
                required
              />
            </div>

            {/* Description */}
            <div className="group">
              <label htmlFor="description" className="form-label">
                Description détaillée *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="form-textarea"
                placeholder="Décrivez votre événement en détail..."
                required
              />
            </div>
          </div>

          {/* Section Date et lieu */}
          <div className="space-y-6">
            <div className="section-header">
              <h3 className="section-title">Date et lieu</h3>
              <div className="section-divider green-blue"></div>
            </div>

            {/* Date et Heure (nouveau) */}
            <div className="flex flex-col items-center gap-6">
              <div className="group w-full max-w-xs flex flex-col justify-center items-center">
                <label className="form-label w-fit">Date et heure de début *</label>
                <DatePicker
                  selected={formData.eventStartTimestamp}
                  onChange={handleStartDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="form-input"
                  placeholderText="Sélectionner la date et l'heure de début"
                  required
                />
              </div>
              <div className="group w-full max-w-xs flex flex-col justify-center items-center">
                <label className="form-label w-fit">Date et heure de fin *</label>
                <DatePicker
                  selected={formData.eventEndTimestamp}
                  onChange={handleEndDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  className="form-input"
                  placeholderText="Sélectionner la date et l'heure de fin"
                  required
                  minDate={formData.eventStartTimestamp || undefined}
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="group">
              <label htmlFor="address" className="form-label">
                Adresse de l'événement *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                placeholder="123 Rue de la Paix, Montréal, QC"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Pré-remplie depuis votre profil. Modifiable pour cet événement.</p>
            </div>

            {/* Coordonnées GPS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="latitude" className="form-label">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                  step="any"
                  className="form-input"
                  placeholder="45.5017"
                />
              </div>
              <div className="group">
                <label htmlFor="longitude" className="form-label">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                  step="any"
                  className="form-input"
                  placeholder="-73.5673"
                />
              </div>
            </div>
          </div>

          {/* Section Catégorisation */}
          <div className="space-y-6">
            <div className="section-header">
              <h3 className="section-title">Catégorisation</h3>
              <div className="section-divider purple-pink"></div>
            </div>

            {/* Catégorie */}
            <div className="group">
              <label htmlFor="category" className="form-label">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                {EVENT_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Icône */}
            <div className="group">
              <IconSelector
                selectedIcon={formData.image}
                onIconSelect={handleIconSelect}
                category={formData.category}
              />
            </div>

            {/* Tags */}
            <div className="group">
              <label className="form-label">
                Tags
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="form-input flex-1"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-primary"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="mr-2">✨</span>
                  Créer l'événement
                  <span className="ml-2">✨</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 