import React from 'react';
import { motion } from 'framer-motion';
import { Building2, CalendarCheck, TrendingUp, Users, ArrowUpRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { properties } from '../../data/properties';
import { mockBookings } from '../../data/mockBookings';

const AdminOverview: React.FC = () => {
  const totalRevenue = mockBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const confirmedBookings = mockBookings.filter(b => b.status === 'CONFIRMED').length;
  const pendingBookings = mockBookings.filter(b => b.status === 'PENDING').length;

  const kpis = [
    { 
      label: 'Total Properties', 
      value: properties.length, 
      icon: <Building2 size={20} />, 
      color: 'bg-blue-50 text-blue-500',
      change: '+3 this month'
    },
    { 
      label: 'Total Bookings', 
      value: mockBookings.length, 
      icon: <CalendarCheck size={20} />, 
      color: 'bg-brand/10 text-brand',
      change: `${confirmedBookings} confirmed`
    },
    { 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      icon: <TrendingUp size={20} />, 
      color: 'bg-green-50 text-green-500',
      change: 'From all bookings'
    },
    { 
      label: 'Pending Reviews', 
      value: pendingBookings, 
      icon: <Clock size={20} />, 
      color: 'bg-amber-50 text-amber-500',
      change: 'Awaiting confirmation'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-bold text-[#1A1A1A]">Dashboard Overview</h1>
        <p className="text-[13px] text-gray-400 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={16} className="text-gray-300" />
            </div>
            <p className="text-[28px] font-bold text-[#1A1A1A] leading-none mb-1">{kpi.value}</p>
            <p className="text-[12px] font-semibold text-gray-500">{kpi.label}</p>
            <p className="text-[11px] text-gray-300 mt-1">{kpi.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-bold text-[#1A1A1A]">Recent Bookings</h2>
          <a href="/admin/bookings" className="text-[12px] text-brand font-medium hover:underline">View all</a>
        </div>
        <div className="divide-y divide-gray-50">
          {mockBookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[13px] font-bold text-gray-500 shrink-0">
                {booking.guestName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{booking.propertyName}</p>
                <p className="text-[11px] text-gray-400">{booking.guestName} · {booking.checkIn} → {booking.checkOut}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[13px] font-bold text-[#1A1A1A]">${booking.totalAmount.toLocaleString()}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-500' :
                  booking.status === 'PENDING' ? 'bg-amber-50 text-amber-500' :
                  'bg-red-50 text-red-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
