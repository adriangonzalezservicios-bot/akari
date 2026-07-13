import { memo } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick?: () => void;
}

export const ProductCard = memo(function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const isOutOfStock = product.inventory === 0;
  const installments = (product.price / 12).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-black/5 group">
      <div 
        className="relative aspect-square w-full bg-gray-50/50 p-6 cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Destacado
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-akari-orange transition-colors cursor-pointer" onClick={onClick}>
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex flex-col gap-3">
          <div>
            <div className="text-xl font-bold text-gray-900 mb-1 leading-none">
              $ {product.price.toFixed(2)}
            </div>
            
            {!isOutOfStock && (
              <div className="text-[11px] text-gray-500 font-medium">
                12 cuotas sin interés de $ {installments}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
            }`}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
});
