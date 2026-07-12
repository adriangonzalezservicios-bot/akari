import React from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  bannerUrl?: string;
}

export function Hero({ bannerUrl = '/src/assets/images/appliances_banner_1783868055333.jpg' }: HeroProps) {
  return (
    <div className="relative w-full mb-12 shadow-sm overflow-hidden bg-white/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
      >
        <img
          src={bannerUrl}
          alt="Banner de electrodomésticos"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
}
