import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Organizer } from '../types/organizer';

const ORGANIZERS_COLLECTION = 'organizers';

// --- Service pour le profil organisateur ---
export const organizerService = {
  async createProfile(uid: string, data: Omit<Organizer, 'uid' | 'createdAt'>): Promise<void> {
    const now = Timestamp.now();
    const organizerProfile: Omit<Organizer, 'uid'> = {
      ...data,
      createdAt: now,
    };
    await setDoc(doc(db, ORGANIZERS_COLLECTION, uid), { ...organizerProfile, uid });
  },

  async getProfile(uid: string): Promise<Organizer | null> {
    const docRef = doc(db, ORGANIZERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Organizer;
    }
    return null;
  }
};

// --- Service d'authentification ---
export const authService = {
  auth: getAuth(),

  signUp: createUserWithEmailAndPassword,
  
  login: signInWithEmailAndPassword,

  logout: () => signOut(authService.auth),

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(authService.auth, callback);
  }
}; 