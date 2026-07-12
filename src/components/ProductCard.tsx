import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const isOutOfStock = product.inventory === 0;
  const installments = (product.price / 12).toFixed(2);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.12)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)] transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-white/60 hover:border-white/80 group">
      <div 
        className="relative aspect-square w-full bg-white/50 p-4 border-b border-white/40 cursor-pointer"
        onClick={onClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`object-contain w-full h-full mix-blend-multiply ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        {product.featured && (
          <div className="absolute top-2 left-2 bg-akari-orange text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Destacado
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="text-2xl font-normal text-gray-800 mb-1 leading-none">
          $ {product.price.toFixed(2)}
        </div>
        
        {!isOutOfStock && (
          <div className="text-xs text-akari-green-dark mb-2">
            Mismo precio en 12 cuotas de $ {installments}
          </div>
        )}

        {!isOutOfStock && product.price > 30 && (
          <div className="text-xs font-semibold text-akari-green mb-2">
            Llega gratis mañana
          </div>
        )}

        <h3 className="text-sm font-light text-gray-600 line-clamp-2 mb-4 group-hover:text-akari-green-dark transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`w-full py-2 rounded-md font-semibold text-sm transition-colors ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-akari-green/10 text-akari-green hover:bg-akari-green hover:text-white'
            }`}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
