import React, { useState } from 'react';
import { Event } from '../types/event';
import IconSelector from './IconSelector';
import { EVENT_CATEGORIES } from '../types/event';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onSubmit: (updated: Partial<Event>) => Promise<void>;
  loading: boolean;
}

// Utilitaire pour obtenir un objet Date
function toDate(val: Date | { toDate: () => Date } | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'object' && typeof (val as any).toDate === 'function') return (val as any).toDate();
  return null;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [eventStartTimestamp, setEventStartTimestamp] = useState<Date | null>(toDate(event.eventStartTimestamp));
  const [eventEndTimestamp, setEventEndTimestamp] = useState<Date | null>(toDate(event.eventEndTimestamp));
  const [address, setAddress] = useState(event.address);
  const [latitude, setLatitude] = useState(event.latitude || 0);
  const [longitude, setLongitude] = useState(event.longitude || 0);
  const [category, setCategory] = useState(event.category);
  const [image, setImage] = useState(event.image);
  const [tags, setTags] = useState<string[]>(event.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isActive, setIsActive] = useState(event.isActive);
  const [error, setError] = useState<string | null>(null);

  // Gestion des tags
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Validation
  const validate = () => {
    if (!title || !description || !eventStartTimestamp || !eventEndTimestamp || !address) {
      setError('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    if (eventEndTimestamp < eventStartTimestamp) {
      setError('La date de fin doit être postérieure à la date de début');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    try {
      await onSubmit({
        title,
        description,
        eventStartTimestamp,
        eventEndTimestamp,
        address,
        latitude,
        longitude,
        category,
        image,
        tags,
        isActive,
      });
    } catch (err) {
      setError("Erreur lors de la modification de l'événement.");
    }
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30, 41, 59, 0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="modal-content card"
        style={{
          width: '80vw',
          maxWidth: 700,
          height: '80vh',
          minWidth: 320,
          position: 'relative',
          boxShadow: '0 8px 32px rgba(30,41,59,0.18)',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.95)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer la modale"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            fontSize: 28,
            fontWeight: 700,
            color: '#64748b',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ×
        </button>
        <h2 className="modal-title section-title" style={{ textAlign: 'center', marginBottom: 24 }}>Modifier l'événement</h2>
        <form
          onSubmit={handleSubmit}
          className="modal-form space-y-6"
          style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}
        >
          <div className="group">
            <label className="form-label">Titre *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="form-input" required />
          </div>
          <div className="group">
            <label className="form-label">Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="form-textarea" rows={3} required />
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="group">
              <label className="form-label">Date et heure de début *</label>
              <DatePicker
                selected={eventStartTimestamp}
                onChange={date => setEventStartTimestamp(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="form-input"
                placeholderText="Sélectionner la date et l'heure de début"
                required
              />
            </div>
            <div className="group">
              <label className="form-label">Date et heure de fin *</label>
              <DatePicker
                selected={eventEndTimestamp}
                onChange={date => setEventEndTimestamp(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="form-input"
                placeholderText="Sélectionner la date et l'heure de fin"
                required
                minDate={eventStartTimestamp || undefined}
              />
            </div>
          </div>
          <div className="group">
            <label className="form-label">Adresse *</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="form-input" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="form-label">Latitude</label>
              <input type="number" value={latitude} onChange={e => setLatitude(parseFloat(e.target.value) || 0)} className="form-input" step="any" />
            </div>
            <div className="group">
              <label className="form-label">Longitude</label>
              <input type="number" value={longitude} onChange={e => setLongitude(parseFloat(e.target.value) || 0)} className="form-input" step="any" />
            </div>
          </div>
          <div className="group">
            <label className="form-label">Catégorie</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="form-select">
              {EVENT_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="group">
            <IconSelector selectedIcon={image} onIconSelect={setImage} category={category} />
          </div>
          <div className="group">
            <label className="form-label">Tags</label>
            <div className="flex gap-3 mb-2">
              <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="form-input flex-1" placeholder="Ajouter un tag" />
              <button type="button" onClick={addTag} className="btn-primary">Ajouter</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          </div>
          <div className="group">
            <label className="form-label">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Actif
            </label>
          </div>
          {error && <div className="modal-error" style={{ color: '#dc2626', marginBottom: 8 }}>{error}</div>}
          <div className="modal-actions flex justify-between mt-6">
            <button type="submit" className="modal-submit btn-primary" disabled={loading}>{loading ? 'Modification...' : 'Modifier'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal; 