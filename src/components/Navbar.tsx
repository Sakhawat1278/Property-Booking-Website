import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Properties', path: '/properties' },
  { label: 'About Us', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
  { label: 'Insights', path: '/insights' },
];

const Navbar = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-50 px-4 md:px-8 flex items-center justify-between pointer-events-auto bg-white border-b border-gray-100">
        {/* Logo */}
        <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative w-8 h-8 md:w-9 md:h-9">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M20 45L50 20L80 45V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V45Z" fill="none" stroke="#FF4D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 80V55H58V80" fill="none" stroke="#FF4D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="50" cy="40" r="3" fill="#FF4D00" />
            </svg>
          </div>
          <span className="text-[20px] md:text-[22px] font-normal tracking-tight text-brand">Nestory</span>
        </div>

        {/* Desktop Nav Pill */}
        <div className="hidden lg:flex bg-[#1A1A1A] rounded-full p-1 h-10 items-center gap-1 pointer-events-auto">
          {navItems.map((item, index) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={item.path} className="relative px-4 py-1.5 text-[13px] font-normal text-white flex items-center gap-1.5 z-10">
                {item.label}
              </Link>
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

        {/* Desktop CTA */}
        <div className="hidden lg:block pointer-events-auto">
          <Link to="/login">
            <motion.button
              whileHover="hover"
              className="group relative flex items-center gap-4 bg-brand text-white pl-6 pr-1 h-10 rounded-full overflow-hidden"
            >
              <span className="text-[14px] font-normal">Sign in</span>
              <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={16} strokeWidth={2} />
              </div>
              <motion.div
                variants={{ hover: { x: '100%' } }}
                initial={{ x: '-100%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </motion.button>
          </Link>
        </div>

        {/* Mobile: Sign in + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/login" className="h-9 px-4 bg-brand text-white text-[13px] font-medium rounded-full flex items-center">
            Sign in
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={22} className="text-[#1A1A1A]" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[70] lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="text-[18px] font-bold text-brand">Nestory</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 p-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-[15px] font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full h-11 bg-brand text-white rounded-full text-[14px] font-medium">
                    Sign In
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
