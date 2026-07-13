import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, Check } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="z-30">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-900" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Filtros</h3>
          </div>
          <div className="text-gray-400">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        <div 
          className={`px-5 transition-all duration-300 ease-in-out origin-top border-t border-black/5 ${
            isOpen ? 'max-h-[800px] py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="mb-8">
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Categorías</h4>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button 
                    onClick={() => onSelectCategory(category)}
                    className="flex items-center justify-between w-full py-2 px-3 rounded-lg text-sm transition-colors hover:bg-gray-50 group"
                  >
                    <span className={`transition-colors ${
                      selectedCategory === category 
                        ? 'text-gray-900 font-semibold' 
                        : 'text-gray-500 group-hover:text-gray-900'
                    }`}>
                      {category}
                    </span>
                    {selectedCategory === category && (
                      <Check size={16} className="text-gray-900" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-4">Precio hasta</h4>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={priceRange[1]}
                readOnly
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg font-semibold text-gray-900 bg-gray-50/50 shadow-sm outline-none"
              />
            </div>
            
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
