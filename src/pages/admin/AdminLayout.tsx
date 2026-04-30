import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, CalendarCheck, Users, 
  LogOut, Menu, X, Shield, Search, Bell, MessageSquare, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../store/useModalStore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/properties', label: 'Properties', icon: <Building2 size={18} /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <CalendarCheck size={18} /> },
  { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
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
    <aside className="w-[240px] bg-white border-r border-gray-100 h-full flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-brand" />
          </div>
          <span className="text-[#1A1A1A] font-bold text-[18px] tracking-tight">Nestory</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-[13px] transition-all group relative ${
                isActive 
                  ? 'bg-gray-50 text-[#1A1A1A] font-bold rounded-xl' 
                  : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50/50 rounded-xl font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand rounded-r-full"
                  />
                )}
                <div className={`${isActive ? 'text-brand' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#1A1A1A] font-bold text-[13px]">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#1A1A1A] truncate">{user?.name || 'Admin'}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-[13px] font-semibold text-gray-500 hover:text-[#1A1A1A] transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#FAFAFA] font-poppins overflow-hidden">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-[#1A1A1A]" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[14px]">
              <LayoutDashboard size={16} className="text-gray-400" />
              <span className="font-bold text-[#1A1A1A]">{currentPathName}</span>
            </div>
          </div>

          {/* Center Search */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, agents, tenants..."
                className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200/60 focus:border-brand rounded-full pl-11 pr-12 text-[13px] focus:outline-none transition-all focus:ring-4 focus:ring-brand/5 placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 shadow-sm">⌘</kbd>
                <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 shadow-sm">/</kbd>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <MessageSquare size={16} />
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors relative">
              <Bell size={16} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand border-2 border-white" />
            </button>
            <button className="hidden sm:flex h-10 bg-brand hover:bg-brand-dark text-white px-5 rounded-full items-center gap-2 text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(255,77,0,0.2)] hover:shadow-[0_4px_16px_rgba(255,77,0,0.3)] hover:-translate-y-0.5">
              <Plus size={16} />
              Add Property
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
