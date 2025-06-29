import React, { useState } from 'react';
import { CATEGORY_ICONS, SPECIAL_ICONS } from '../types/event';

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (icon: string) => void;
  category: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({ selectedIcon, onIconSelect, category }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Obtenir les icônes disponibles selon la catégorie
  const getAvailableIcons = () => {
    const categoryIcons = CATEGORY_ICONS[category] || [];
    const specialIcons = SPECIAL_ICONS[category] || [];
    
    // Combiner les icônes et supprimer les doublons
    const allIcons = Array.from(new Set([...categoryIcons, ...specialIcons]));
    
    // Si aucune icône spécifique n'est trouvée, utiliser les icônes "Autre"
    return allIcons.length > 0 ? allIcons : CATEGORY_ICONS['Autre'] || ['🎉'];
  };

  const availableIcons = getAvailableIcons();

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="form-label">
        Icône de l'événement
      </label>
      
      {/* Bouton de sélection */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="form-input text-center text-2xl cursor-pointer hover:border-blue-400 transition-colors"
      >
        {selectedIcon || '🎉'}
      </button>

      {/* Dropdown des icônes */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-2xl shadow-lg backdrop-blur-sm">
          <div className="p-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Choisissez une icône pour votre événement
            </div>
            
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {availableIcons.map((icon, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className={`w-12 h-12 text-2xl rounded-xl border-2 transition-all duration-200 hover:scale-110 hover:shadow-md ${
                    selectedIcon === icon
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  title={`Sélectionner ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Icônes disponibles pour la catégorie "{category}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default IconSelector; 