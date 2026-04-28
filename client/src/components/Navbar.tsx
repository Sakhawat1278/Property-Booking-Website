import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Properties', path: '/properties', hasDropdown: true },
  { label: 'About Us', path: '/about', hasDropdown: false },
  { label: 'Services', path: '/services', hasDropdown: false },
  { label: 'Contact', path: '/contact', hasDropdown: false }, // Changed from Awards
  { label: 'Insights', path: '/insights', hasDropdown: true },
];

const Navbar = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 px-8 flex items-center justify-between pointer-events-auto bg-white border-b border-gray-100">
      {/* Logo Section */}
      <div className="flex items-center gap-2 pointer-events-auto group cursor-pointer">
        <motion.div 
          className="relative w-9 h-9"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Minimalist House Icon */}
            <path 
              d="M20 45L50 20L80 45V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V45Z" 
              fill="none" 
              stroke="#FF4D00" 
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M42 80V55H58V80" 
              fill="none" 
              stroke="#FF4D00" 
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="50" cy="40" r="3" fill="#FF4D00" />
          </svg>
        </motion.div>
        
        <Link to="/" className="text-[22px] font-normal tracking-tight text-brand">
          Nestory
        </Link>
      </div>

      {/* Center Navigation Pill */}
      <div className="bg-[#1A1A1A] rounded-full p-1 h-10 flex items-center gap-1 pointer-events-auto">
        {navItems.map((item, index) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {item.path ? (
              <Link to={item.path} className="relative px-5 py-1.5 text-[14px] font-normal text-white transition-colors flex items-center gap-1.5 z-10">
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="text-white" />}
              </Link>
            ) : (
              <button className="relative px-5 py-1.5 text-[14px] font-normal text-white transition-colors flex items-center gap-1.5 z-10">
                {item.label}
                {item.hasDropdown && <ChevronDown size={14} className="text-white" />}
              </button>
            )}
            
            {/* Sliding Hover Background */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 rounded-full -z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="pointer-events-auto">
        <Link to="/login">
          <motion.button
            whileHover="hover"
            className="group relative flex items-center gap-4 bg-brand text-white pl-6 pr-1 h-10 rounded-full overflow-hidden"
          >
            <span className="text-[14px] font-normal">Sign in</span>
            <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={16} strokeWidth={2} />
            </div>
            
            {/* Subtle Shine Effect */}
            <motion.div
              variants={{
                hover: { x: '100%' }
              }}
              initial={{ x: '-100%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </motion.button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
