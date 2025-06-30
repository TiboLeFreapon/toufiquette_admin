import { Timestamp } from 'firebase/firestore';

export interface Organizer {
  uid: string;
  organizerName: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: Timestamp;
} 