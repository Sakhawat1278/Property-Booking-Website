import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X, Users, CalendarDays, DollarSign, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
  CANCELLED: 'bg-red-50 text-red-400 border-red-100',
};

const AdminBookings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();

    // Realtime listener
    const channel = supabase
      .channel('admin-bookings-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties (
            title,
            primaryImage,
            price
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      console.error('Error fetching bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      setSelectedBooking(prev => prev ? { ...prev, status } : null);
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    }
  };

  const filtered = bookings.filter(b => {
    const propertyTitle = b.property?.title || '';
    const matchesSearch = 
      b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1A1A1A]">Bookings & Inquiries</h1>
        <p className="text-[13px] text-gray-400 mt-1">Manage all rental reservations and property viewing requests.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest, property or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 h-10 rounded-full text-[12px] font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Property</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type / Dates</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((booking, i) => (
                <motion.tr
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-[10px] font-mono font-bold text-gray-400">
                    #{booking.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={booking.property?.primaryImage} alt="" className="w-9 h-9 rounded-xl object-cover bg-gray-100" />
                      <span className="text-[13px] font-semibold text-[#1A1A1A] whitespace-nowrap">{booking.property?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{booking.guest_name}</p>
                    <p className="text-[11px] text-gray-400">{booking.guest_email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-1 inline-block ${
                      booking.type === 'BOOKING' ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'
                    }`}>
                      {booking.type}
                    </span>
                    {booking.check_in ? (
                      <p className="text-[11px] font-medium text-[#1A1A1A] whitespace-nowrap">
                        {new Date(booking.check_in).toLocaleDateString()} → {new Date(booking.check_out).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">No dates specified</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1A1A1A]">
                    ${booking.total_amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-[12px] text-brand font-medium hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-[13px]">No records match your search.</div>
          )}
        </div>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[18px] font-bold text-[#1A1A1A]">Request Details</h2>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Property */}
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <img src={selectedBooking.property?.primaryImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{selectedBooking.property?.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[selectedBooking.status]}`}>
                        {selectedBooking.status}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{selectedBooking.type}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  <button 
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                    disabled={selectedBooking.status === 'CONFIRMED'}
                    className="h-10 bg-green-500 text-white text-[12px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Confirm Request
                  </button>
                  <button 
                    onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                    disabled={selectedBooking.status === 'CANCELLED'}
                    className="h-10 bg-red-50 text-red-500 text-[12px] font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Cancel / Reject
                  </button>
                </div>

                {/* Guest Information */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={13} /> Guest Information</h3>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Name</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.guest_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Email</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.guest_email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Phone</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.guest_phone || 'Not provided'}</span>
                    </div>
                    {selectedBooking.type === 'BOOKING' && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-[12px] text-gray-500">Guests</span>
                        <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.adults} Adults, {selectedBooking.children} Children</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stay Details / Viewing Details */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CalendarDays size={13} /> {selectedBooking.type === 'BOOKING' ? 'Stay Details' : 'Viewing Schedule'}</h3>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">{selectedBooking.type === 'BOOKING' ? 'Check-in' : 'Requested Date'}</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.check_in ? new Date(selectedBooking.check_in).toLocaleDateString() : 'TBD'}</span>
                    </div>
                    {selectedBooking.check_out && (
                      <div className="flex justify-between">
                        <span className="text-[12px] text-gray-500">Check-out</span>
                        <span className="text-[12px] font-semibold text-[#1A1A1A]">{new Date(selectedBooking.check_out).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-[12px] text-gray-500">Submitted On</span>
                      <span className="text-[12px] font-semibold text-gray-400">{new Date(selectedBooking.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Financials (If Booking) */}
                {selectedBooking.type === 'BOOKING' && (
                  <div className="mb-6">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign size={13} /> Financial Overview</h3>
                    <div className="p-5 bg-[#1A1A1A] rounded-2xl">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-gray-400">Total Amount Paid</span>
                        <span className="text-[20px] font-bold text-white">${selectedBooking.total_amount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
