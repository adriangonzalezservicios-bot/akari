import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white/40 backdrop-blur-md pt-12 pb-8 border-t border-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-akari-orange text-2xl">🦊</span>
              <span className="text-xl font-extrabold text-akari-green-outline tracking-tight">AKARI</span>
            </div>
            <p className="text-akari-brown/80 text-sm mb-4">
              Electrodomésticos y decoración con el toque perfecto para tu hogar. Funcionalidad y ternura.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-akari-brown hover:text-akari-orange transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-akari-brown hover:text-akari-orange transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-akari-brown hover:text-akari-orange transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-bold text-akari-green mb-4">Menú</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Inicio</a></li>
              <li><a href="#shop" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Tienda</a></li>
              <li><a href="#featured" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Destacados</a></li>
              <li><a href="#about" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Nosotros</a></li>
            </ul>
          </div>

          {/* Legal / Useful Links */}
          <div>
            <h3 className="font-bold text-akari-green mb-4">Enlaces Útiles</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Políticas de Envío</a></li>
              <li><a href="#" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-akari-brown/80 hover:text-akari-orange transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-akari-green mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-akari-brown/80">
                <MapPin size={18} className="text-akari-orange shrink-0 mt-0.5" />
                <span>Av. Kawaii 123, Local 4, CABA</span>
              </li>
              <li className="flex items-center gap-3 text-akari-brown/80">
                <Phone size={18} className="text-akari-orange shrink-0" />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-akari-brown/80">
                <Mail size={18} className="text-akari-orange shrink-0" />
                <span>hola@akarielectro.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-akari-brown/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-akari-brown/60">
          <p>© {new Date().getFullYear()} Akari Electro & Home. Todos los derechos reservados.</p>
          <div className="flex gap-4 items-center">
            <a href="#admin" className="hover:text-akari-orange transition-colors font-medium">Panel Admin</a>
            <p>Diseñado con ♥ para tu hogar</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
