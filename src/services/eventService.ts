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
      // Conversion des dates JS en Timestamp Firebase
      const event: Omit<Event, 'id'> = {
        ...eventData,
        organizerId,
        organizerName,
        eventStartTimestamp: eventData.eventStartTimestamp ? Timestamp.fromDate(eventData.eventStartTimestamp) : now,
        eventEndTimestamp: eventData.eventEndTimestamp ? Timestamp.fromDate(eventData.eventEndTimestamp) : now,
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

  // Mettre à jour un événement existant
  async updateEvent(eventId: string, updatedData: Partial<Event>): Promise<void> {
    try {
      const eventRef = doc(db, EVENTS_COLLECTION, eventId);
      // Conversion éventuelle des dates JS en Timestamp Firebase
      const dataToUpdate: any = { ...updatedData };
      if (dataToUpdate.eventStartTimestamp instanceof Date) {
        dataToUpdate.eventStartTimestamp = Timestamp.fromDate(dataToUpdate.eventStartTimestamp);
      }
      if (dataToUpdate.eventEndTimestamp instanceof Date) {
        dataToUpdate.eventEndTimestamp = Timestamp.fromDate(dataToUpdate.eventEndTimestamp);
      }
      dataToUpdate.updatedAt = Timestamp.now();
      await updateDoc(eventRef, dataToUpdate);
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