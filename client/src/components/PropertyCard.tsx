import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Bed, Bath, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyCardProps {
  property: any;
  index: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = property.imageGallery ? property.imageGallery.split(',') : [property.primaryImage];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // SVG for Location Icon to avoid ReferenceError
  const IconLocation = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );

  return (
    <motion.div
      onClick={() => navigate(`/properties/${property.slug}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group border border-gray-200 rounded-[24px] bg-white p-2 hover:border-brand/30 transition-all duration-500 cursor-pointer"
    >
      <div className="relative aspect-[16/10] rounded-[18px] overflow-hidden mb-3">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            src={images[currentImageIndex]}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className={`absolute inset-0 flex items-center justify-between px-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={prevImage}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:bg-white shadow-lg transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextImage}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:bg-white shadow-lg transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {property.status === 'FOR_RENT' && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-50">
            <span className="text-[#1A1A1A] font-bold text-[10px]">Guest Favorite</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-50 text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={16} />
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`transition-all duration-300 rounded-full ${i === currentImageIndex ? 'w-2.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="px-2 pb-2">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="text-[14px] font-bold text-[#1A1A1A] group-hover:text-brand transition-colors truncate flex-1 pr-2 uppercase tracking-tight">{property.title}</h3>
          <span className="text-[14px] font-bold text-[#1A1A1A]">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0 }).format(property.price)}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-[#0E9272] text-[10px] mb-3">
          <div className="w-4 h-4 rounded-full bg-[#0E9272]/10 flex items-center justify-center">
            <IconLocation />
          </div>
          <span className="truncate opacity-80">{property.address || property.city}</span>
        </div>
        
        <div className="border-t border-gray-100 mb-3" />
        
        <div className="flex items-center justify-between text-gray-500 text-[11px] font-medium px-0.5">
          <div className="flex items-center gap-1.5">
            <Bed size={14} className="text-gray-400" />
            <span>{property.bedrooms || 0} Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={14} className="text-gray-400" />
            <span>{property.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 size={14} className="text-gray-400" />
            <span>{property.totalArea || property.area || '1600'} SQ</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
