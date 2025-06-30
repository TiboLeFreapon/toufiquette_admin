import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event, EventFormData } from '../types/event';

const EVENTS_COLLECTION = 'events';

export const eventService = {
  // Ajouter un nouvel événement
  async addEvent(
    eventData: EventFormData, 
    organizerId: string, 
    organizerName: string
  ): Promise<string> {
    try {
      const now = Timestamp.now();
      
      // Convertir la date et l'heure en timestamps
      const [startTime, endTime] = eventData.time.split(' - ');
      const [day, month, year] = eventData.date.split('/');
      
      const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const [startHour, startMinute] = startTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
      
      const endDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const [endHour, endMinute] = endTime.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      const event: Omit<Event, 'id'> = {
        ...eventData,
        organizerId,
        organizerName,
        eventStartTimestamp: Timestamp.fromDate(startDateTime),
        eventEndTimestamp: Timestamp.fromDate(endDateTime),
        createdAt: now,
        updatedAt: now,
        isActive: true
      };

      const docRef = await addDoc(collection(db, EVENTS_COLLECTION), event);
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'événement:', error);
      throw error;
    }
  },

  // Récupérer tous les événements
  async getAllEvents(): Promise<Event[]> {
    try {
      const q = query(
        collection(db, EVENTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },

  // Récupérer un événement par ID
  async getEventById(id: string): Promise<Event | null> {
    try {
      const docRef = doc(db, EVENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Event;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      throw error;
    }
  },

  // Mettre à jour un événement
  async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<void> {
    try {
      const docRef = doc(db, EVENTS_COLLECTION, id);
      const updateData: any = {
        ...eventData,
        updatedAt: Timestamp.now()
      };

      // Si la date ou l'heure est modifiée, recalculer les timestamps
      if (eventData.date && eventData.time) {
        const [startTime, endTime] = eventData.time.split(' - ');
        const [day, month, year] = eventData.date.split('/');
        
        const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const [startHour, startMinute] = startTime.split(':');
        startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        
        const endDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const [endHour, endMinute] = endTime.split(':');
        endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

        updateData.eventStartTimestamp = Timestamp.fromDate(startDateTime);
        updateData.eventEndTimestamp = Timestamp.fromDate(endDateTime);
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  },

  // Supprimer un événement
  async deleteEvent(id: string): Promise<void> {
    try {
      const docRef = doc(db, EVENTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  },

  // Récupérer les événements actifs
  async getActiveEvents(): Promise<Event[]> {
    try {
      const q = query(
        collection(db, EVENTS_COLLECTION),
        where('isActive', '==', true),
        orderBy('eventStartTimestamp', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error) {
      console.error('Erreur lors de la récupération des événements actifs:', error);
      throw error;
    }
  },

  // Récupérer les événements d'un organisateur spécifique
  async getEventsByOrganizer(organizerId: string): Promise<Event[]> {
    try {
      const q = query(
        collection(db, EVENTS_COLLECTION),
        where('organizerId', '==', organizerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
    } catch (error) {
      console.error("Erreur lors de la récupération des événements de l'organisateur:", error);
      throw error;
    }
  }
}; 