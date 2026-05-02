import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, CalendarCheck, Users, 
  LogOut, Menu, X, Shield, Search, Bell, MessageSquare, Plus, Home,
  Target, UserCheck, CreditCard, BarChart3, Settings, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../store/useModalStore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/properties', label: 'Properties', icon: <Building2 size={18} /> },
  { to: '/admin/leads', label: 'Leads', icon: <Target size={18} /> },
  { to: '/admin/users', label: 'Agents & Owners', icon: <UserCheck size={18} /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <CalendarCheck size={18} /> },
  { to: '/admin/buyers', label: 'Buyers', icon: <Users size={18} /> },
  { to: '/admin/transactions', label: 'Transactions', icon: <CreditCard size={18} /> },
  { to: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
  { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { openModal } = useModalStore();

  const handleLogout = () => {
    openModal({
      title: 'Sign Out',
      description: 'Are you sure you want to securely log out of the admin console?',
      confirmText: 'Sign Out',
      danger: true,
      onConfirm: () => {
        logout();
        navigate('/login');
      }
    });
  };

  const currentPathName = navItems.find(item => item.to === location.pathname)?.label || 'Dashboard';

  const Sidebar = () => (
    <aside className="w-[240px] bg-white border-r border-gray-200 h-full flex flex-col shrink-0 font-poppins">
      {/* Brand matching Listora style */}
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-indigo-500" />
          </div>
          <span className="text-black font-bold text-[18px] tracking-tight">Nestory</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 mt-6 overflow-y-auto scrollbar-hide">
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
                  : 'text-black hover:bg-gray-50/50 rounded-lg font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-indigo-500' : 'text-gray-300 transition-colors'}`}>
                  {item.icon}
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile Panel */}
      <div className="mx-3 mb-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-black font-bold text-[14px] shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-black truncate">{user?.name || 'Admin'}</span>
            <span className="text-[10px] font-bold text-black opacity-40 uppercase tracking-tighter">Administrator</span>
          </div>
        </div>
        <Link to="/admin/profile" className="block w-full">
          <button className="w-full py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-black hover:bg-gray-100 transition-all">
            Profile Settings
          </button>
        </Link>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-black hover:bg-gray-50 rounded-xl transition-all group"
        >
          <LogOut size={16} className="text-black opacity-30 group-hover:opacity-100 transition-opacity" />
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-white font-poppins overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#FBFCFE]">
        {/* Top Bar - No Shadow, Slick Borders */}
        <header className="h-[64px] bg-white border-b border-gray-200 flex items-center justify-between px-6 gap-6 shrink-0 relative z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} className="text-[#1A1A1A]" />
            </button>
            
            {/* Search Bar - Slick Rounded, No Shadow */}
            <div className="flex items-center flex-1 max-w-2xl">
              <div className="relative w-full group">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search properties, agents, tenants..."
                  className="w-full h-9 bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-indigo-500/20 rounded-lg pl-10 pr-10 text-[13px] focus:outline-none transition-all placeholder:text-black/70"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold">/</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-black transition-all" title="Go to Website">
                <Home size={16} />
              </Link>
              <button className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-black transition-all">
                <MessageSquare size={16} />
              </button>
              <button className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-black transition-all relative">
                <Bell size={16} />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 border border-white" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-200 mx-1" />

            <div className="flex items-center gap-3 pl-1">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-[13px] font-bold text-black leading-none">{user?.name || 'Admin'}</span>
                <span className="text-[10px] font-bold text-black opacity-40 uppercase tracking-tighter mt-1">Administrator</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-black font-bold text-[13px] shrink-0 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
