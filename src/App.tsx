import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { Filters } from './components/Filters';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ChatWidget } from './components/ChatWidget';
import { PackageSearch, Sparkles, FilterX } from 'lucide-react';
import { useStoreData } from './features/store/hooks/useStoreData';

const AdminPanel = lazy(() => import('./features/admin/AdminPanel').then(({ AdminPanel }) => ({ default: AdminPanel })));

export default function App() {
  const [route, setRoute] = useState(window.location.hash);
  const { products: productsQuery, settings: settingsQuery } = useStoreData();
  const products = productsQuery.data ?? [];
  const settings = settingsQuery.data!;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const maxPrice = Math.ceil(Math.max(0, ...products.map((product) => product.price)));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  useEffect(() => { const onChange = () => setRoute(window.location.hash); window.addEventListener('hashchange', onChange); return () => window.removeEventListener('hashchange', onChange); }, []);
  useEffect(() => { setPriceRange([0, maxPrice]); }, [maxPrice]);

  const categories = useMemo(() => ['Todas', ...new Set(products.map((product) => product.category))], [products]);
  const filteredProducts = useMemo(() => products.filter((product) => (selectedCategory === 'Todas' || product.category === selectedCategory) && product.price >= priceRange[0] && product.price <= priceRange[1]), [products, selectedCategory, priceRange]);
  const featuredProducts = useMemo(() => products.filter((product) => product.featured), [products]);
  const addToCart = (product: Product) => {
    if (!product.inventory) return alert('¡Lo sentimos! Este producto está agotado.');
    setCartItems((items) => { const existing = items.find((item) => item.id === product.id); return existing ? items.map((item) => item.id === product.id && item.quantity < product.inventory ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]; });
    setIsCartOpen(true);
  };
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  if (route === '#admin') return <Suspense fallback={<Loading />}><AdminPanel /></Suspense>;
  if (productsQuery.isLoading || settingsQuery.isLoading) return <Loading />;
  if (productsQuery.isError || settingsQuery.isError) return <div className="min-h-screen grid place-items-center p-6 text-center">No se pudo cargar la tienda. Intenta nuevamente más tarde.</div>;
  return <div className="min-h-screen font-sans bg-[#FAFAFA] text-gray-900">
    <Header cartItemCount={totalItems} onOpenCart={() => setIsCartOpen(true)} logoUrl={settings.logoUrl || '/logo.png'} />
    <main className="pb-24"><Hero settings={settings} />
      {featuredProducts.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 pt-8"><div className="flex items-center gap-3 mb-10"><Sparkles size={28} /><h2 className="text-3xl font-extrabold">Destacados</h2></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{featuredProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} onAddToCart={addToCart} onClick={() => setSelectedProduct(product)} />)}</div></section>}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center gap-3 mb-10 border-t border-black/5 pt-16"><PackageSearch size={28} /><h2 className="text-3xl font-extrabold">Explorar Tienda</h2></div><div className="flex flex-col lg:flex-row gap-10"><aside className="w-full lg:w-72"><Filters categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} priceRange={priceRange} onPriceChange={setPriceRange} maxPrice={maxPrice} /></aside><div className="flex-1">{filteredProducts.length ? <div className="grid grid-cols-2 md:grid-cols-3 gap-6">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={addToCart} onClick={() => setSelectedProduct(product)} />)}</div> : <div className="bg-white rounded-2xl p-16 text-center"><FilterX className="mx-auto mb-4" size={48} /><p>No encontramos productos con esos filtros.</p><button className="mt-6 font-semibold" onClick={() => { setSelectedCategory('Todas'); setPriceRange([0, maxPrice]); }}>Limpiar filtros</button></div>}</div></div></section>
    </main>
    <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={(id, quantity) => setCartItems((items) => items.map((item) => item.id === id ? { ...item, quantity } : item))} onRemoveItem={(id) => setCartItems((items) => items.filter((item) => item.id !== id))} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
    <CheckoutModal settings={settings} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} total={totalPrice} onSuccess={() => { setCartItems([]); setIsCheckoutOpen(false); }} /><ProductDetailsModal product={selectedProduct} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} /><Footer settings={settings} /><ChatWidget />
  </div>;
}
function Loading() { return <div className="min-h-screen grid place-items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" /></div>; }
