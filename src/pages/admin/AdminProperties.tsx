import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Bed, Bath, Star, Edit3, Trash2,
  ToggleLeft, ToggleRight, ChevronDown, Plus
} from 'lucide-react';
import { properties as allProperties } from '../../data/properties';
import { useModalStore } from '../../store/useModalStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const statusLabels: Record<string, string> = {
  FOR_SALE: 'For Sale',
  FOR_RENT: 'For Rent',
  OFF_PLAN: 'Off Plan',
};
type Property = (typeof allProperties)[0];

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      toast.error('Error fetching properties: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    openModal({
      title: 'Delete Property',
      description: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete Property',
      danger: true,
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          setProperties(prev => prev.filter(p => p.id !== id));
          toast.success('Property deleted successfully');
        } catch (err: any) {
          toast.error('Delete failed: ' + err.message);
        }
      }
    });
  };

  const toggleVerification = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ isVerified: !current })
        .eq('id', id);
      
      if (error) throw error;

      setProperties(prev => prev.map(p => p.id === id ? { ...p, isVerified: !current } : p));
      toast.success(current ? 'Property unverified' : 'Property verified');
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1A1A1A]">Property Management</h1>
          <p className="text-[13px] text-gray-400 mt-1">Manage your listings, edit details, and track performance.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 bg-white border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto h-11 bg-white border border-gray-200 rounded-full pl-5 pr-10 text-[13px] font-medium text-[#1A1A1A] appearance-none focus:outline-none focus:border-brand transition-colors cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="FOR_SALE">For Sale</option>
              <option value="FOR_RENT">For Rent</option>
              <option value="OFF_PLAN">Off Plan</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => navigate('/admin/properties/new')}
            className="w-full sm:w-auto h-11 bg-brand hover:bg-brand-dark text-white px-6 rounded-full items-center justify-center gap-2 text-[13px] font-bold transition-all shadow-[0_4px_12px_rgba(255,77,0,0.2)] hover:shadow-[0_4px_16px_rgba(255,77,0,0.3)] hover:-translate-y-0.5 flex"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Property</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:border-gray-200 transition-colors flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden bg-gray-100 shrink-0">
                <img src={p.primaryImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md ${
                    p.status === 'FOR_SALE' ? 'bg-blue-500/20 text-blue-100 border-blue-400/30' :
                    p.status === 'FOR_RENT' ? 'bg-green-500/20 text-green-100 border-green-400/30' :
                    'bg-purple-500/20 text-purple-100 border-purple-400/30'
                  }`}>
                    {statusLabels[p.status]}
                  </span>
                </div>

                {/* Price */}
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-[20px] leading-none">
                    ${p.price.toLocaleString()}
                    {p.status === 'FOR_RENT' && <span className="text-[12px] font-medium text-white/70">/mo</span>}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-tight line-clamp-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-[12px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                    <Star size={12} className="fill-current" />
                    {p.rating}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                  <MapPin size={14} />
                  <span className="text-[12px] font-medium truncate">{p.neighborhood}, {p.city}</span>
                </div>

                <div className="flex items-center gap-4 py-3 border-y border-gray-50 mb-auto">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Bed size={16} className="text-gray-400" />
                    <span className="text-[13px] font-semibold">{p.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Bath size={16} className="text-gray-400" />
                    <span className="text-[13px] font-semibold">{p.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span className="text-[13px] font-semibold">{p.totalArea} <span className="text-[11px] text-gray-400 font-normal">sqft</span></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-1">
                  <button 
                    onClick={() => toggleVerification(p.id, p.isVerified)}
                    className="flex items-center gap-2 text-[12px] font-semibold text-gray-500 hover:text-[#1A1A1A] transition-colors"
                  >
                    {p.isVerified ? (
                      <><ToggleRight size={20} className="text-brand" /> Verified</>
                    ) : (
                      <><ToggleLeft size={20} className="text-gray-300" /> Unverified</>
                    )}
                  </button>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => navigate(`/admin/properties/edit/${p.id}`)}
                      className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                      title="Edit Property"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Property"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-300" />
          </div>
          <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-1">No properties found</h3>
          <p className="text-[13px] text-gray-400">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
