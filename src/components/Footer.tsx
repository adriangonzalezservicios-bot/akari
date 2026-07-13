import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src={settings.logoUrl || "/logo.png"} alt="Akari Logo" className="h-10 object-contain" />
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Descubre electrodomésticos y decoración con un diseño único y funcional para transformar tus espacios.
            </p>
            <div className="flex gap-4">
              <a href={settings.instagramUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Instagram size={20} /></a>
              <a href={settings.facebookUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Facebook size={20} /></a>
              <a href={settings.twitterUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 uppercase tracking-wider text-sm">Navegación</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Inicio</a></li>
              <li><a href="#shop" className="text-gray-500 hover:text-gray-900 transition-colors">Tienda</a></li>
              <li><a href="#featured" className="text-gray-500 hover:text-gray-900 transition-colors">Destacados</a></li>
              <li><a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors">Nosotros</a></li>
            </ul>
          </div>

          {/* Legal / Useful Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 uppercase tracking-wider text-sm">Ayuda</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Envíos</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Términos Legales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-5 uppercase tracking-wider text-sm">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-500 hover:text-gray-900 transition-colors cursor-default">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>{settings.contactAddress || 'Av. Principal 123, Ciudad'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors cursor-default">
                <Phone size={18} className="shrink-0" />
                <span>{settings.contactPhone || '+1 234 567 890'}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors cursor-default">
                <Mail size={18} className="shrink-0" />
                <span>{settings.contactEmail || 'hola@akarielectro.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Akari. Todos los derechos reservados.</p>
          <div className="flex gap-6 items-center">
            <a href="#admin" className="hover:text-gray-900 transition-colors font-medium">Panel Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
