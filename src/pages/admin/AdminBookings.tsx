import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X, Users, CalendarDays, DollarSign, Loader2, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
  PENDING: 'bg-orange-50 text-orange-600 border-orange-100',
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
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black">Bookings & Reservations</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Manage property rentals, payments, and stay schedules.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            placeholder="Search by guest, property or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-indigo-500/20 transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-200">
          {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 h-8 rounded-md text-[11px] font-bold transition-all ${
                statusFilter === s
                  ? 'bg-white text-black border border-gray-200'
                  : 'text-black/50 hover:text-black'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Guest / Property</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Stay Period</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Total Paid</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={booking.property?.primaryImage} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                      <div>
                        <p className="text-[13px] font-bold text-black">{booking.guest_name}</p>
                        <p className="text-[11px] text-black font-medium">{booking.property?.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {booking.check_in ? (
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-black">{new Date(booking.check_in).toLocaleDateString()}</span>
                        <span className="text-[11px] text-black font-medium uppercase tracking-tighter">to {new Date(booking.check_out).toLocaleDateString()}</span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-black/40 italic">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-bold text-black">${booking.total_amount?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-black/40">
              <Calendar size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No bookings found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedBooking(null)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 overflow-y-auto border-l border-gray-200"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[18px] font-bold text-black">Booking Confirmation</h2>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-50 rounded-lg">
                    <X size={18} className="text-black" />
                  </button>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 mb-8">
                   <div className="flex gap-4 mb-4">
                      <img src={selectedBooking.property?.primaryImage} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                      <div>
                         <h3 className="text-[15px] font-bold text-black">{selectedBooking.property?.title}</h3>
                         <p className="text-[12px] text-black font-medium">{selectedBooking.guest_name}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                      <div>
                         <p className="text-[10px] font-bold text-black/40 uppercase mb-1">Status</p>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${statusColors[selectedBooking.status]}`}>
                            {selectedBooking.status}
                         </span>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-black/40 uppercase mb-1">Total Paid</p>
                         <p className="text-[14px] font-bold text-black">${selectedBooking.total_amount?.toLocaleString()}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-3">Guest Details</h4>
                      <div className="space-y-3">
                         <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-[12px] text-black">Email Address</span>
                            <span className="text-[12px] font-bold text-black">{selectedBooking.guest_email}</span>
                         </div>
                         <div className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-[12px] text-black">Phone Number</span>
                            <span className="text-[12px] font-bold text-black">{selectedBooking.guest_phone || 'Not provided'}</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4">
                      <button 
                        onClick={() => updateBookingStatus(selectedBooking.id, 'CONFIRMED')}
                        disabled={selectedBooking.status === 'CONFIRMED'}
                        className="flex-1 h-11 bg-black text-white rounded-lg text-[13px] font-bold hover:bg-gray-900 transition-all disabled:opacity-50"
                      >
                        Approve Booking
                      </button>
                      <button 
                        onClick={() => updateBookingStatus(selectedBooking.id, 'CANCELLED')}
                        disabled={selectedBooking.status === 'CANCELLED'}
                        className="flex-1 h-11 bg-white border border-gray-200 text-black rounded-lg text-[13px] font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
                      >
                        Decline
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBookings;
