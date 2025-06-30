import { Timestamp } from 'firebase/firestore';

export interface Event {
  id?: string;
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  category: string;
  image: string;
  tags: string[];
  isActive: boolean;
  organizerId: string;
  organizerName: string;
  eventStartTimestamp: Date | Timestamp;
  eventEndTimestamp: Date | Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface EventFormData {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  tags: string[];
  image: string;
  eventStartTimestamp: Date | null;
  eventEndTimestamp: Date | null;
}

export const EVENT_CATEGORIES = [
  'Musique',
  'Sport',
  'Culture',
  'Gastronomie',
  'Art',
  'Technologie',
  'Business',
  'Loisirs',
  'Autre'
] as const;

export type EventCategory = typeof EVENT_CATEGORIES[number];

// Icônes par catégorie
export const CATEGORY_ICONS: Record<string, string[]> = {
  'Musique': ['🎵', '🎶', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧'],
  'Sport': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏊', '🏃', '🚴', '🏋️', '🤸', '⛷️', '🏂', '🏄'],
  'Culture': ['🎨', '🎭', '🎪', '🎬', '🎤', '🎧', '🎼', '🎹', '🎻', '🎺', '🎷', '🥁'],
  'Gastronomie': ['🍽️', '🍕', '🍔', '🍜', '🍣', '🍱', '🥘', '🍲', '🥗', '🍰', '🍩', '🍪', '☕', '🍷', '🍺'],
  'Art': ['🎨', '🖼️', '🎭', '🎪', '🎬', '📷', '🎥', '🎬', '🎤', '🎧'],
  'Technologie': ['💻', '📱', '🖥️', '⌨️', '🖱️', '🔌', '💡', '⚡', '🔋', '📡', '🌐', '🚀'],
  'Business': ['💼', '📊', '📈', '📉', '💰', '💳', '🏢', '📞', '📧', '📋', '📝', '✍️'],
  'Loisirs': ['🎮', '🎲', '🎯', '🎳', '🎪', '🎨', '📚', '🎭', '🎬', '🎤', '🎧', '🎼'],
  'Autre': ['🎉', '🎊', '🎈', '🎁', '🎂', '🎃', '🎄', '🎅', '🎆', '🎇', '✨', '💫', '🌟', '⭐', '💎', '🔮', '🎪', '🎭']
};

// Icônes spéciales pour les catégories spécifiques
export const SPECIAL_ICONS: Record<string, string[]> = {
  'Nature': ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌸', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲'],
  'Tourisme': ['🗺️', '🧭', '🏔️', '🏖️', '🏝️', '🏜️', '🏛️', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛰️', '🌊', '🏄', '🚣', '⛵'],
  'Spectacle': ['🎭', '🎪', '🎬', '🎤', '🎧', '🎼', '🎹', '🎻', '🎺', '🎷', '🥁', '🎵', '��', '🎻', '🥁']
}; 