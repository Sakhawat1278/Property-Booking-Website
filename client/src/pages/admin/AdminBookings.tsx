import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, X, Users, CalendarDays, DollarSign } from 'lucide-react';
import { mockBookings } from '../../data/mockBookings';

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-green-50 text-green-600 border-green-100',
  PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
  CANCELLED: 'bg-red-50 text-red-400 border-red-100',
};

const AdminBookings: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);

  const filtered = mockBookings.filter(b => {
    const matchesSearch = 
      b.guestName.toLowerCase().includes(search.toLowerCase()) ||
      b.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-[#1A1A1A]">Bookings</h1>
        <p className="text-[13px] text-gray-400 mt-1">Manage all rental bookings and reservations.</p>
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
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Guests</th>
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
                  <td className="px-6 py-4 text-[12px] font-mono font-bold text-gray-400">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={booking.propertyImage} alt="" className="w-9 h-9 rounded-xl object-cover bg-gray-100" />
                      <span className="text-[13px] font-semibold text-[#1A1A1A] whitespace-nowrap">{booking.propertyName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{booking.guestName}</p>
                    <p className="text-[11px] text-gray-400">{booking.guestEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] font-medium text-[#1A1A1A] whitespace-nowrap">{booking.checkIn}</p>
                    <p className="text-[11px] text-gray-400 whitespace-nowrap">→ {booking.checkOut} · {booking.nights}n</p>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500">
                    {booking.adults}A {booking.children > 0 ? `· ${booking.children}C` : ''}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-[#1A1A1A]">
                    ${booking.totalAmount.toLocaleString()}
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
            <div className="py-16 text-center text-gray-400 text-[13px]">No bookings match your search.</div>
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
                  <h2 className="text-[18px] font-bold text-[#1A1A1A]">Booking Details</h2>
                  <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Property */}
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <img src={selectedBooking.propertyImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{selectedBooking.propertyName}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[selectedBooking.status]}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                {/* Booking ID & Date */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
                    <p className="text-[14px] font-bold text-[#1A1A1A] font-mono">{selectedBooking.id}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Booked On</p>
                    <p className="text-[14px] font-bold text-[#1A1A1A]">{selectedBooking.bookedAt}</p>
                  </div>
                </div>

                {/* Guest */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Users size={13} /> Guest Information</h3>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Name</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Email</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.guestEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Adults</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.adults}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Children</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.children}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CalendarDays size={13} /> Stay Details</h3>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Check-in</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.checkIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Check-out</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.checkOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Duration</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">{selectedBooking.nights} nights</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><DollarSign size={13} /> Pricing Breakdown</h3>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">${selectedBooking.pricePerNight.toLocaleString()} × {selectedBooking.nights} nights</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">${(selectedBooking.pricePerNight * selectedBooking.nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Cleaning fee</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">${selectedBooking.cleaningFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[12px] text-gray-500">Service fee</span>
                      <span className="text-[12px] font-semibold text-[#1A1A1A]">${selectedBooking.serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-[13px] font-bold text-[#1A1A1A]">Total</span>
                      <span className="text-[16px] font-bold text-brand">${selectedBooking.totalAmount.toLocaleString()}</span>
                    </div>
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
