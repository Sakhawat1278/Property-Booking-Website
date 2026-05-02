import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ArrowUpRight, Menu, X, User, 
  LogOut, LayoutDashboard, Settings, ShieldCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Logout button clicked');
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleNavigate = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Navigating to:', path);
    setUserDropdownOpen(false);
    navigate(path);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    return user.role === 'ADMIN' ? '/admin' : user.role === 'AGENCY' ? '/agency' : '/';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 md:h-20 z-[100] px-4 md:px-8 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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
        <div className="hidden lg:flex bg-[#1A1A1A] rounded-full p-1 h-10 items-center gap-1">
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

        {/* Desktop CTA / User Menu */}
        <div className="hidden lg:block relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 bg-gray-50 text-[#1A1A1A] pl-1 pr-4 h-10 rounded-full border transition-all ${userDropdownOpen ? 'border-brand ring-4 ring-brand/5 bg-white' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'}`}
              >
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-[13px] shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-[14px] font-medium truncate max-w-[120px]">{user.name}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden py-3 z-[9999]"
                  >
                    <div className="px-5 py-4 border-b border-gray-50 mb-2">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[14px] font-bold text-gray-900 leading-tight">{user.name}</span>
                          {user.role === 'ADMIN' && <ShieldCheck size={14} className="text-brand" />}
                       </div>
                       <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                    </div>

                    <button 
                      onClick={(e) => handleNavigate(getDashboardPath(), e)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors text-left"
                    >
                      <LayoutDashboard size={18} className="opacity-40" />
                      Dashboard
                    </button>

                    <button 
                      onClick={(e) => handleNavigate(`${getDashboardPath()}/profile`, e)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors text-left"
                    >
                      <User size={18} className="opacity-40" />
                      Profile Settings
                    </button>

                    <button 
                      onClick={(e) => handleNavigate(`${getDashboardPath()}/settings`, e)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors text-left"
                    >
                      <Settings size={18} className="opacity-40" />
                      Account Settings
                    </button>

                    <div className="h-px bg-gray-50 my-2 mx-3" />

                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
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
          )}
        </div>

        {/* Mobile Nav Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {user ? (
            <button 
              onClick={() => setMobileOpen(true)}
              className="h-9 pl-1 pr-4 bg-gray-50 border border-gray-200 text-[#1A1A1A] rounded-full flex items-center gap-2 transition-colors"
            >
               <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-[12px] shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="text-[13px] font-medium truncate max-w-[80px]">{user.name?.split(' ')[0]}</span>
            </button>
          ) : (
            <Link to="/login" className="h-9 px-4 bg-brand text-white text-[13px] font-medium rounded-full flex items-center">
              Sign in
            </Link>
          )}
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
              className="fixed inset-0 bg-black/40 z-[1000] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[1001] lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-[20px] font-bold text-brand uppercase tracking-tight">Nestory</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <nav className="flex-1 p-6 flex flex-col gap-2">
                {user && (
                   <div className="p-5 mb-6 bg-gray-50 rounded-[24px] border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[18px]">
                            {user.name?.charAt(0).toUpperCase()}
                         </div>
                         <div>
                            <p className="text-[15px] font-bold text-gray-900">{user.name}</p>
                            <p className="text-[11px] text-gray-400">{user.email}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-1 gap-1">
                         <button onClick={(e) => { setMobileOpen(false); navigate(getDashboardPath()); }} className="flex items-center gap-3 p-3 text-[14px] font-medium text-gray-700 hover:text-brand transition-colors text-left">
                            <LayoutDashboard size={18} className="opacity-40" /> Dashboard
                         </button>
                         <button onClick={(e) => { setMobileOpen(false); navigate(`${getDashboardPath()}/profile`); }} className="flex items-center gap-3 p-3 text-[14px] font-medium text-gray-700 hover:text-brand transition-colors text-left">
                            <User size={18} className="opacity-40" /> Profile Settings
                         </button>
                      </div>
                   </div>
                )}
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3.5 rounded-xl text-[16px] font-medium text-[#1A1A1A] hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                {user ? (
                   <button 
                    onClick={handleLogout}
                    className="w-full h-12 bg-red-50 text-red-600 rounded-full text-[15px] font-bold flex items-center justify-center gap-2 transition-colors"
                   >
                     <LogOut size={18} /> Sign Out
                   </button>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <button className="w-full h-12 bg-brand text-white rounded-full text-[15px] font-medium">
                      Sign In
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
