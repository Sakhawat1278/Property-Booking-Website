import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, CalendarCheck, Users, 
  LogOut, Menu, X, Search, Bell, MessageSquare, Plus,
  Target, User as UserIcon, Settings, BarChart3, Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../store/useModalStore';

const navItems = [
  { to: '/agency', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/agency/properties', label: 'My Properties', icon: <Building2 size={18} /> },
  { to: '/agency/leads', label: 'Property Leads', icon: <Target size={18} /> },
  { to: '/agency/bookings', label: 'Bookings', icon: <CalendarCheck size={18} /> },
  { to: '/agency/analytics', label: 'Performance', icon: <BarChart3 size={18} /> },
  { to: '/agency/settings', label: 'Agency Profile', icon: <Settings size={18} /> },
];

const AgencyLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openModal } = useModalStore();

  const handleLogout = () => {
    openModal({
      title: 'Sign Out',
      description: 'Are you sure you want to log out of your agency portal?',
      confirmText: 'Sign Out',
      danger: true,
      onConfirm: () => {
        logout();
        navigate('/login');
      }
    });
  };

  const Sidebar = () => (
    <aside className="w-[260px] bg-white border-r border-gray-200 h-full flex flex-col shrink-0 font-poppins">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-emerald-500" />
          </div>
          <span className="text-black font-bold text-[18px] tracking-tight italic">Nestory Partners</span>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1 mt-4 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all group relative ${
                isActive 
                  ? 'bg-gray-50 text-black font-bold rounded-lg' 
                  : 'text-black hover:text-black hover:bg-gray-50/50 rounded-lg font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-emerald-500' : 'text-black transition-colors opacity-30 group-hover:opacity-100'}`}>
                  {item.icon}
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 bg-gray-50/50 rounded-xl border border-gray-100">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
             <span className="text-black font-bold text-[14px]">
               {user?.name?.charAt(0).toUpperCase() || 'A'}
             </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-black truncate">{user?.name || 'Agency User'}</span>
            <button onClick={handleLogout} className="text-[10px] text-red-500 hover:underline text-left font-bold uppercase tracking-wider">Log Out</button>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-white font-poppins overflow-hidden">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.div initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 25 }} className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFCFE]">
        <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={18} className="text-black" />
            </button>
            
            <div className="flex items-center flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                <input
                  type="text"
                  placeholder="Search your listings, leads..."
                  className="w-full h-9 bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-emerald-500/20 rounded-lg pl-10 pr-4 text-[13px] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-black transition-colors" title="Go to Website">
              <Home size={16} />
            </Link>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-black transition-colors relative">
              <Bell size={16} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
            <Link to="/agency/properties/new">
              <button className="h-9 px-4 bg-emerald-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all ml-2 shadow-sm">
                <Plus size={16} />
                New Listing
              </button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;
