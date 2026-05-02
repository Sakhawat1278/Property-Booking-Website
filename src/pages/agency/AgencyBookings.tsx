import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, User, Building2, Loader2, X, CheckCircle2, AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const AgencyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      fetchAgencyBookings();
    }
  }, [user]);

  const fetchAgencyBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*, properties!inner(title, owner_id, primaryImage)')
        .eq('properties.owner_id', user?.id)
        .eq('type', 'BOOKING')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (err: any) {
      toast.error('Error fetching bookings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await 
      if (error) throw error;
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      setSelectedBooking(prev => prev ? { ...prev, status } : null);
      toast.success(`Booking ${status.toLowerCase()} successfully`);
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    }
  };

  const filtered = bookings.filter(b => 
    b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    b.properties?.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div>
        <h1 className="text-[20px] font-bold text-black">Rental Bookings</h1>
        <p className="text-[12px] text-black/60 mt-0.5">Track reservations, check-in dates, and payment statuses for your properties.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
        <input
          type="text"
          placeholder="Search guest or property..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-emerald-500/20"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Guest / Property</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Stay Period</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={booking.properties?.primaryImage} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200" />
                      <div>
                        <p className="text-[13px] font-bold text-black">{booking.guest_name}</p>
                        <p className="text-[11px] text-black font-medium">{booking.properties?.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-black">{new Date(booking.check_in).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-black/40 uppercase">to {new Date(booking.check_out).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-bold text-black">
                    ${booking.total_amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' :
                      booking.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      'bg-red-50 text-red-500 border-red-100'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedBooking(booking)} className="text-[11px] font-bold text-emerald-600 hover:underline">
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-black/40">
              <Calendar size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No rental bookings found for your listings.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBooking(null)} className="fixed inset-0 bg-black/40 z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 border-l border-gray-200 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-[18px] font-bold text-black">Booking Details</h2>
                   <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors"><X size={18} /></button>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100 mb-8">
                   <div className="flex gap-4 mb-4">
                      <img src={selectedBooking.properties?.primaryImage} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                      <div>
                         <h3 className="text-[15px] font-bold text-black">{selectedBooking.properties?.title}</h3>
                         <p className="text-[12px] text-black font-medium">{selectedBooking.guest_name}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200/50">
                      <div>
                         <p className="text-[10px] font-bold text-black/40 uppercase mb-1">Status</p>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            selectedBooking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                         }`}>
                            {selectedBooking.status}
                         </span>
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-black/40 uppercase mb-1">Guest Contact</p>
                         <p className="text-[12px] font-bold text-black truncate">{selectedBooking.guest_email}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => updateStatus(selectedBooking.id, 'CONFIRMED')}
                        disabled={selectedBooking.status === 'CONFIRMED'}
                        className="flex-1 h-11 bg-emerald-600 text-white rounded-lg text-[13px] font-bold hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50"
                      >
                        Confirm Booking
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedBooking.id, 'CANCELLED')}
                        disabled={selectedBooking.status === 'CANCELLED'}
                        className="flex-1 h-11 bg-white border border-gray-200 text-red-500 rounded-lg text-[13px] font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                      >
                        Decline
                      </button>
                   </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgencyBookings;
