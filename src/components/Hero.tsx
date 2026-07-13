import React from 'react';
import { motion } from 'motion/react';
import { SiteSettings } from '../types';

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  const bannerUrl = settings.bannerUrl || '/banner.jpg';
  const title = settings.heroTitle || 'El toque perfecto para tu hogar';
  const subtitle = settings.heroSubtitle || 'Descubre electrodomésticos y decoración con un diseño único y funcional.';

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full max-w-7xl mx-auto h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden my-4 md:my-8 shadow-sm border border-black/5"
      >
        <img
          src={bannerUrl}
          alt="Banner de electrodomésticos"
          className="w-full h-full object-cover scale-105"
        />
        {/* Subtle Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-8 md:p-16 lg:p-24">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 tracking-tight leading-tight"
            >
              {title}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-xl text-gray-200 font-medium max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
