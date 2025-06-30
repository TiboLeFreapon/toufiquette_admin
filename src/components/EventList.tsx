import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { Event } from '../types/event';
import { useAuth } from '../context/AuthContext';
import EditEventModal from './EditEventModal';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [currentUser]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      let eventsData: Event[];
      if (currentUser) {
        // Si l'utilisateur est connecté, ne montrer que ses événements
        eventsData = await eventService.getEventsByOrganizer(currentUser.uid);
      } else {
        // Sinon, montrer tous les événements
        eventsData = await eventService.getAllEvents();
      }
      setEvents(eventsData);
    } catch (err) {
      setError('Erreur lors du chargement des événements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDate = (val: any): Date | undefined => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === 'object' && typeof val.toDate === 'function') return val.toDate();
    return undefined;
  };

  const formatDate = (timestamp: any) => {
    const date = getDate(timestamp);
    if (!date) return 'N/A';
    return date.toLocaleDateString('fr-CA', { timeZone: 'America/Toronto' });
  };

  const formatTime = (timestamp: any) => {
    const date = getDate(timestamp);
    if (!date) return 'N/A';
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' });
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
  };

  const handleEditSubmit = async (updated: Partial<Event>) => {
    if (!editingEvent) return;
    setEditLoading(true);
    try {
      await eventService.updateEvent(editingEvent.id!, updated);
      setEditingEvent(null);
      await loadEvents();
    } catch (err) {
      setEditLoading(false);
      throw err;
    }
    setEditLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">Chargement des événements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message error">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="section-title text-center mb-6">
        {currentUser ? "Mes Événements" : "Tous les Événements"}
      </h2>
      
      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          Aucun événement trouvé.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isPast = getDate(event.eventEndTimestamp) && getDate(event.eventEndTimestamp)! < new Date();
            const cardClasses = `card ${isPast ? 'is-past' : ''}`;

            let statusBadge = null;
            if (isPast) {
              statusBadge = <span className="status-badge is-past-badge">Passé</span>;
            } else if (event.isActive) {
              statusBadge = <span className="status-badge is-active-badge">Actif</span>;
            } else {
              statusBadge = <span className="status-badge is-inactive-badge">Inactif</span>;
            }

            return (
              <div key={event.id} className={cardClasses} style={{ position: 'relative' }}>
                {statusBadge}
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{event.image}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span className="font-medium">Période:</span>
                      <span className="ml-2">
                        {formatDate(event.eventStartTimestamp)} {formatTime(event.eventStartTimestamp)}
                        {' - '}
                        {formatDate(event.eventEndTimestamp)} {formatTime(event.eventEndTimestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-medium">Catégorie:</span>
                      <span className="ml-2">{event.category}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="font-medium">Adresse:</span>
                      <span className="ml-2 truncate">{event.address}</span>
                    </div>
                  </div>
                  
                  {event.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="tag"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    <div>Créé le: {formatDate(event.createdAt)}</div>
                    <div>Modifié le: {formatDate(event.updatedAt)}</div>
                  </div>
                  <button
                      className="edit-btn"
                      title="Modifier l'événement"
                      onClick={() => handleEditClick(event)}
                      style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 20 }}
                    >
                      Modifier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleEditSubmit}
          loading={editLoading}
        />
      )}
    </div>
  );
};

export default EventList; 