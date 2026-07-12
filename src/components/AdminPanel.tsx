import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Product, SiteSettings } from '../types';
import { LogOut, Settings, Package, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';

export function AdminPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ bannerUrl: '/src/assets/images/appliances_banner_1783868055333.jpg' });
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch settings
      const settingsDoc = await getDoc(doc(db, 'settings', 'main'));
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as SiteSettings);
      } else {
        await setDoc(doc(db, 'settings', 'main'), { bannerUrl: '/src/assets/images/appliances_banner_1783868055333.jpg' });
      }

      // Fetch products
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsList = productsSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(productsList);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Error de conexión. Si usas bloqueadores de anuncios (como Brave o uBlock), intenta desactivarlos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error de autenticación');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'main'), settings);
      alert('Configuración guardada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error guardando configuración');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isNew = !currentProduct.id;
      const id = currentProduct.id || Date.now().toString(); // simple ID generator for new items
      const productToSave = {
        ...currentProduct,
        id,
        price: Number(currentProduct.price) || 0,
        inventory: Number(currentProduct.inventory) || 0,
      } as Product;

      await setDoc(doc(db, 'products', id), productToSave);
      
      setProducts(prev => {
        if (isNew) return [...prev, productToSave];
        return prev.map(p => p.id === id ? productToSave : p);
      });
      
      setIsEditingProduct(false);
      setCurrentProduct({});
    } catch (err) {
      console.error(err);
      alert('Error guardando producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error eliminando producto');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-akari-cream/30 p-4">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/60">
          <h2 className="text-3xl font-extrabold text-akari-brown mb-6 text-center">
            {isLoginMode ? 'Panel de Administrador' : 'Crear Cuenta Admin'}
          </h2>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-akari-green text-white font-bold rounded-xl hover:bg-akari-green-dark transition-colors"
            >
              {isLoginMode ? 'Ingresar' : 'Registrar'}
            </button>
          </form>
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="w-full mt-4 text-sm text-gray-500 hover:text-akari-orange transition-colors"
          >
            {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="block text-center mt-6 text-sm font-bold text-akari-orange hover:underline">Volver a la tienda</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-6 flex flex-col shrink-0">
        <div className="flex items-center gap-2 mb-10">
          <span className="text-akari-orange text-2xl">🦊</span>
          <span className="text-xl font-extrabold text-akari-green-outline tracking-tight">ADMIN</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => { setActiveTab('products'); setIsEditingProduct(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'products' ? 'bg-akari-green/10 text-akari-green-dark' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Package size={20} />
            Productos
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsEditingProduct(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${activeTab === 'settings' ? 'bg-akari-green/10 text-akari-green-dark' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Settings size={20} />
            Diseño / Banner
          </button>
        </nav>

        <div className="mt-auto space-y-4 pt-8 border-t border-gray-100">
          <a href="#" onClick={() => window.location.hash = ''} className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-akari-orange font-medium transition-colors">
            Volver a la Tienda
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">{error}</div>}
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akari-orange"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ImageIcon className="text-akari-orange" />
                  Configuración del Banner Principal
                </h2>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen del Banner</label>
                    <input 
                      type="text" 
                      value={settings.bannerUrl} 
                      onChange={e => setSettings({...settings, bannerUrl: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">Puedes poner un link a cualquier imagen para actualizar la cabecera de la tienda.</p>
                  </div>
                  {settings.bannerUrl && (
                    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden h-40 relative">
                      <img src={settings.bannerUrl} alt="Vista previa del banner" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Vista Previa</div>
                    </div>
                  )}
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-akari-green text-white font-bold rounded-xl hover:bg-akari-green-dark transition-colors"
                  >
                    Guardar Cambios
                  </button>
                </form>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div>
                {!isEditingProduct ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Tus Productos</h2>
                      <button 
                        onClick={() => { setCurrentProduct({ category: 'Cocina', featured: false }); setIsEditingProduct(true); }}
                        className="flex items-center gap-2 bg-akari-orange text-white px-4 py-2 rounded-xl font-bold hover:bg-akari-orange/90 transition-colors"
                      >
                        <Plus size={20} /> Agregar Producto
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50 text-gray-600 text-sm">
                            <tr>
                              <th className="p-4 font-semibold">Producto</th>
                              <th className="p-4 font-semibold">Precio</th>
                              <th className="p-4 font-semibold">Stock</th>
                              <th className="p-4 font-semibold">Categoría</th>
                              <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {products.map(product => (
                              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                  <span className="font-medium text-gray-800">{product.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">${product.price.toFixed(2)}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.inventory > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.inventory > 0 ? `${product.inventory} un.` : 'Agotado'}
                                  </span>
                                </td>
                                <td className="p-4 text-gray-600">{product.category}</td>
                                <td className="p-4 text-right">
                                  <button 
                                    onClick={() => { setCurrentProduct(product); setIsEditingProduct(true); }}
                                    className="p-2 text-gray-400 hover:text-akari-green transition-colors"
                                  >
                                    <Edit2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {products.length === 0 && (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                  No tienes productos creados. ¡Agrega el primero!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {currentProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
                      </h2>
                      <button 
                        onClick={() => setIsEditingProduct(false)}
                        className="text-gray-500 hover:text-gray-800 font-medium"
                      >
                        Cancelar
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
                          <input 
                            type="text" 
                            value={currentProduct.name || ''} 
                            onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                          <input 
                            type="text" 
                            value={currentProduct.category || ''} 
                            onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Precio ($)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={currentProduct.price || ''} 
                            onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Inventario (Stock)</label>
                          <input 
                            type="number" 
                            value={currentProduct.inventory || ''} 
                            onChange={e => setCurrentProduct({...currentProduct, inventory: Number(e.target.value)})}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">URL de la Imagen</label>
                        <input 
                          type="text" 
                          value={currentProduct.image || ''} 
                          onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                        <textarea 
                          rows={4}
                          value={currentProduct.description || ''} 
                          onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-akari-orange outline-none resize-none"
                          required
                        />
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={currentProduct.featured || false}
                          onChange={e => setCurrentProduct({...currentProduct, featured: e.target.checked})}
                          className="w-5 h-5 rounded text-akari-orange focus:ring-akari-orange"
                        />
                        <span className="font-semibold text-gray-700">Producto Destacado</span>
                      </label>

                      <div className="flex gap-4 pt-4">
                        <button 
                          type="submit"
                          className="px-6 py-3 bg-akari-green text-white font-bold rounded-xl hover:bg-akari-green-dark transition-colors"
                        >
                          Guardar Producto
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
