import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Users, CalendarDays, DollarSign, Calendar } from 'lucide-react';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
  PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
  CANCELLED: 'bg-red-50 text-red-400 border-red-100',
};

const AdminBookings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Local state management for bookings
  }, []);

  const filtered = bookings.filter(b => {
    const matchesSearch = b.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
                        b.property?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Booking Management</h1>
          <p className="text-[13px] text-black/40 font-medium">Review and manage all property reservations</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" />
            <input
              type="text"
              placeholder="Search by guest or property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-[13px] focus:bg-white focus:border-black outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-black/20 mr-2" />
            {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 h-10 rounded-xl text-[12px] font-bold transition-all border ${
                  statusFilter === status 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-gray-100 hover:border-gray-200'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Guest Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Reservation</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Financials</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-[13px] font-medium">
                    No bookings found matching your filters
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[13px] font-bold text-black">{booking.guest_name}</p>
                        <p className="text-[11px] text-black/40 font-medium">{booking.guest_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-[13px] font-bold text-black">{booking.property?.title}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase">
                          <Calendar size={10} /> {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-black">${booking.total_price?.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-black/30 uppercase tracking-tighter">Paid via Credit Card</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${statusColors[booking.status]}`}>
                         {booking.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
