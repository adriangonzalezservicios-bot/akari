import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  maxPrice: number;
}

export function Filters({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  maxPrice
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-32 pr-0 lg:pr-4 z-30">
      <div className="bg-white/40 backdrop-blur-md rounded-xl shadow-sm border border-white/60 overflow-hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 hover:bg-white/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-akari-green" />
            <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
          </div>
          <div className="text-gray-500">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <div 
          className={`px-4 transition-all duration-300 ease-in-out origin-top ${
            isOpen ? 'max-h-[500px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="mb-8">
            <h4 className="font-semibold text-sm text-gray-800 mb-3">Categorías</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button 
                    onClick={() => onSelectCategory(category)}
                    className={`text-sm text-left w-full transition-colors ${
                      selectedCategory === category 
                        ? 'text-akari-green-dark font-semibold' 
                        : 'text-gray-600 hover:text-akari-green-dark'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-4">Precio</h4>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="number"
                value={priceRange[0]}
                readOnly
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center text-gray-600 bg-white/50 shadow-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                readOnly
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-center text-gray-600 bg-white/50 shadow-sm"
              />
            </div>
            
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={5}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-akari-green mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
