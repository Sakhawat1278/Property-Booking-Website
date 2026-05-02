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
    <aside className="w-[260px] bg-white border-r border-gray-100 h-full flex flex-col shrink-0">
      {/* Brand */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand to-purple-500 flex items-center justify-center shadow-lg shadow-brand/20">
            <div className="w-4 h-4 rounded-full bg-white/30 backdrop-blur-sm border border-white/50" />
          </div>
          <span className="text-[#1A1A1A] font-bold text-[20px] tracking-tight">Nestory</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-[14px] transition-all group relative ${
                isActive 
                  ? 'bg-gray-50 text-brand font-bold rounded-2xl' 
                  : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50/50 rounded-2xl font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`${isActive ? 'text-brand' : 'text-gray-400 group-hover:text-brand transition-colors'}`}>
                  {item.icon}
                </div>
                {item.label}
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-brand" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand font-bold text-[14px]">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#1A1A1A] truncate">{user?.name || 'Admin'}</span>
            <span className="text-[11px] text-gray-400 font-medium">Administrator</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={16} />
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
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F9FB]">
        {/* Top Bar */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 gap-8 shrink-0 relative z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} className="text-[#1A1A1A]" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#1A1A1A]">{currentPathName}</span>
            </div>

            {/* Search Bar matching Listora */}
            <div className="hidden md:flex items-center flex-1 max-w-2xl ml-8">
              <div className="relative w-full group">
                <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties, agents, tenants..."
                  className="w-full h-12 bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-brand/30 rounded-2xl pl-12 pr-12 text-[14px] focus:outline-none transition-all placeholder:text-gray-400"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-40">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold">/</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors">
                <MessageSquare size={18} />
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500 transition-colors relative">
                <Bell size={18} />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand border-2 border-white" />
              </button>
            </div>
            
            <Link to="/admin/properties/new">
              <button className="h-11 px-6 bg-brand text-white rounded-2xl text-[14px] font-bold flex items-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand/20">
                <Plus size={18} />
                Add Property
              </button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
