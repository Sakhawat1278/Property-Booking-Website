import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, MapPin, Bed, Bath, Star, Edit3, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { properties as allProperties } from '../../data/properties';
import { useNavigate } from 'react-router-dom';

const statusColors: Record<string, string> = {
  FOR_SALE: 'bg-blue-50 text-blue-500 border-blue-100',
  FOR_RENT: 'bg-green-50 text-green-500 border-green-100',
  OFF_PLAN: 'bg-purple-50 text-purple-500 border-purple-100',
};

const statusLabels: Record<string, string> = {
  FOR_SALE: 'For Sale',
  FOR_RENT: 'For Rent',
  OFF_PLAN: 'Off Plan',
};

const AdminProperties: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [verifiedStates, setVerifiedStates] = useState<Record<string, boolean>>(
    Object.fromEntries(allProperties.map(p => [p.id, p.isVerified]))
  );

  const categories = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'LUXURY', 'VACATION'];

  const filtered = allProperties.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      (p.country || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleVerified = (id: string) => {
    setVerifiedStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1A1A1A]">Properties</h1>
          <p className="text-[13px] text-gray-400 mt-1">{allProperties.length} total listings on the platform.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, city or country..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 h-10 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                categoryFilter === c
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {c === 'ALL' ? 'All' : c.charAt(0) + c.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-[12px] text-gray-400">{filtered.length} properties</p>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {filtered.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={property.primaryImage}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Status Badge */}
              <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusColors[property.status]}`}>
                {statusLabels[property.status]}
              </span>

              {/* Verified Toggle */}
              <button
                onClick={() => toggleVerified(property.id)}
                className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold transition-all hover:bg-white"
              >
                {verifiedStates[property.id] ? (
                  <><ToggleRight size={14} className="text-green-500" /><span className="text-green-600">Verified</span></>
                ) : (
                  <><ToggleLeft size={14} className="text-gray-400" /><span className="text-gray-400">Unverified</span></>
                )}
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-[14px] font-bold text-[#1A1A1A] leading-tight">{property.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-gray-500">{property.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400 mb-3">
                <MapPin size={11} />
                <span className="text-[11px]">{property.city}{property.country ? `, ${property.country}` : ''}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-400 mb-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed size={12} />
                    <span>{property.bedrooms} beds</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Bath size={12} />
                  <span>{property.bathrooms} baths</span>
                </div>
                <span>{property.totalArea.toLocaleString()} sqft</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[18px] font-bold text-[#1A1A1A]">
                    {property.currency} {property.price.toLocaleString()}
                    {property.status === 'FOR_RENT' && <span className="text-[12px] font-normal text-gray-400">/mo</span>}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/properties/${property.slug}`)}
                    className="h-8 px-3 bg-gray-50 border border-gray-200 text-[11px] font-semibold text-gray-500 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    className="h-8 w-8 bg-red-50 border border-red-100 text-red-400 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400 text-[13px]">No properties match your search.</div>
      )}
    </div>
  );
};

export default AdminProperties;
