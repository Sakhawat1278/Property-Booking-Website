import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Bed, Bath, Star, Edit3, Trash2,
  ToggleLeft, ToggleRight, X, Save, AlertTriangle, ChevronDown
} from 'lucide-react';
import { properties as allProperties } from '../../data/properties';

/* ─────────────────────── helpers ─────────────────────── */
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
type Property = (typeof allProperties)[0];

/* ─────────────────────── Delete Confirmation Modal ─────────────────────── */
const DeleteModal: React.FC<{
  property: Property;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ property, onConfirm, onCancel }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        {/* Icon */}
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={26} className="text-red-500" />
        </div>

        <h2 className="text-[18px] font-bold text-center text-[#1A1A1A] mb-2">Delete Property</h2>
        <p className="text-[13px] text-gray-500 text-center leading-relaxed mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-[13px] font-bold text-[#1A1A1A] text-center mb-5 px-4 truncate">
          "{property.title}"
        </p>
        <p className="text-[11px] text-red-400 text-center mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-2xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-2xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

/* ─────────────────────── Edit Slide Panel ─────────────────────── */
const EditPanel: React.FC<{
  property: Property;
  onClose: () => void;
  onSave: (updated: Property) => void;
}> = ({ property, onClose, onSave }) => {
  const [form, setForm] = useState({ ...property });
  const set = (field: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-[#1A1A1A]">Edit Property</h2>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate max-w-[260px]">{property.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Property Image Preview */}
          <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-100">
            <img src={form.primaryImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-3 text-white text-[11px] font-bold bg-black/40 px-3 py-1 rounded-full">
              Cover Image
            </div>
          </div>

          {/* Title */}
          <Field label="Title">
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="input-edit"
              placeholder="Property title"
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              rows={4}
              className="input-edit resize-none"
              placeholder="Property description"
            />
          </Field>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price">
              <input
                type="number"
                value={form.price}
                onChange={e => set('price', Number(e.target.value))}
                className="input-edit"
              />
            </Field>
            <Field label="Currency">
              <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input-edit">
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
                <option value="AED">AED د.إ</option>
                <option value="SGD">SGD S$</option>
                <option value="AUD">AUD A$</option>
              </select>
            </Field>
          </div>

          {/* Status & Category */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Listing Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} className="input-edit">
                <option value="FOR_SALE">For Sale</option>
                <option value="FOR_RENT">For Rent</option>
                <option value="OFF_PLAN">Off Plan</option>
              </select>
            </Field>
            <Field label="Category">
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input-edit">
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="LUXURY">Luxury</option>
                <option value="VACATION">Vacation</option>
              </select>
            </Field>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input value={form.city} onChange={e => set('city', e.target.value)} className="input-edit" />
            </Field>
            <Field label="Country">
              <input value={form.country || ''} onChange={e => set('country', e.target.value)} className="input-edit" />
            </Field>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Field label="Bedrooms">
              <input type="number" value={form.bedrooms} onChange={e => set('bedrooms', Number(e.target.value))} className="input-edit" />
            </Field>
            <Field label="Bathrooms">
              <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', Number(e.target.value))} className="input-edit" />
            </Field>
            <Field label="Area (sqft)">
              <input type="number" value={form.totalArea} onChange={e => set('totalArea', Number(e.target.value))} className="input-edit" />
            </Field>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div>
              <p className="text-[13px] font-semibold text-[#1A1A1A]">Verified Listing</p>
              <p className="text-[11px] text-gray-400">Mark as verified on the platform</p>
            </div>
            <button
              onClick={() => set('isVerified', !form.isVerified)}
              className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${form.isVerified ? 'bg-brand' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${form.isVerified ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 h-11 rounded-2xl bg-[#1A1A1A] text-white text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-brand transition-colors"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </motion.div>
    </>
  );
};

/* tiny reusable field wrapper */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
  </div>
);

/* ─────────────────────── Main Page ─────────────────────── */
const AdminProperties: React.FC = () => {
  const [propertyList, setPropertyList] = useState([...allProperties]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [verifiedStates, setVerifiedStates] = useState<Record<string, boolean>>(
    Object.fromEntries(allProperties.map(p => [p.id, p.isVerified]))
  );
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

  const categories = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'LUXURY', 'VACATION'];

  const filtered = propertyList.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      (p.country || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (updated: Property) => {
    setPropertyList(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setVerifiedStates(prev => ({ ...prev, [updated.id]: updated.isVerified }));
    setEditingProperty(null);
  };

  const handleDelete = () => {
    if (!deletingProperty) return;
    setPropertyList(prev => prev.filter(p => p.id !== deletingProperty.id));
    setDeletingProperty(null);
  };

  const toggleVerified = (id: string) => {
    setVerifiedStates(prev => ({ ...prev, [id]: !prev[id] }));
    setPropertyList(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-[22px] md:text-[24px] font-bold text-[#1A1A1A]">Properties</h1>
          <p className="text-[13px] text-gray-400 mt-1">{propertyList.length} total listings on the platform.</p>
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
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-full text-[13px] focus:outline-none focus:border-[#1A1A1A] transition-colors"
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

      <p className="text-[12px] text-gray-400">{filtered.length} properties</p>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden group"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={property.primaryImage}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              <span className={`absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[property.status]}`}>
                {statusLabels[property.status]}
              </span>

              <button
                onClick={() => toggleVerified(property.id)}
                className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold transition-all hover:bg-white"
              >
                {verifiedStates[property.id] ? (
                  <><ToggleRight size={12} className="text-green-500" /><span className="text-green-600">Verified</span></>
                ) : (
                  <><ToggleLeft size={12} className="text-gray-400" /><span className="text-gray-400">Unverified</span></>
                )}
              </button>
            </div>

            {/* Body */}
            <div className="p-3">
              <div className="flex items-start justify-between gap-1 mb-1">
                <h3 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-1">{property.title}</h3>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-gray-500">{property.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400 mb-2">
                <MapPin size={10} />
                <span className="text-[10px] truncate">{property.city}{property.country ? `, ${property.country}` : ''}</span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 mb-3">
                {property.bedrooms > 0 && <span className="flex items-center gap-0.5"><Bed size={10} />{property.bedrooms}bd</span>}
                <span className="flex items-center gap-0.5"><Bath size={10} />{property.bathrooms}ba</span>
              </div>

              <p className="text-[15px] font-bold text-[#1A1A1A] mb-3">
                {property.currency} {property.price.toLocaleString()}
                {property.status === 'FOR_RENT' && <span className="text-[10px] font-normal text-gray-400">/mo</span>}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingProperty(property)}
                  className="flex-1 h-8 bg-[#1A1A1A] text-white text-[11px] font-semibold rounded-full hover:bg-brand transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit3 size={11} /> Edit
                </button>
                <button
                  onClick={() => setDeletingProperty(property)}
                  className="h-8 w-8 bg-red-50 border border-red-100 text-red-400 rounded-full hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-gray-400 text-[13px]">No properties match your search.</div>
      )}

      {/* Edit Panel */}
      <AnimatePresence>
        {editingProperty && (
          <EditPanel
            property={editingProperty}
            onClose={() => setEditingProperty(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletingProperty && (
          <DeleteModal
            property={deletingProperty}
            onConfirm={handleDelete}
            onCancel={() => setDeletingProperty(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProperties;
