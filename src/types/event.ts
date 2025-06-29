import { Timestamp } from 'firebase/firestore';

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  eventStartTimestamp: Timestamp;
  eventEndTimestamp: Timestamp;
  tags: string[];
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  tags: string[];
  image: string;
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
  'Spectacle': ['🎭', '🎪', '🎬', '🎤', '🎧', '🎼', '🎹', '🎻', '🎺', '🎷', '🥁', '🎵', '🎶', '🎸', '🎹', '��', '🎻', '🥁']
}; 