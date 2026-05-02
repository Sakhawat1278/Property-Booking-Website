import React, { useState, useEffect } from 'react';
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

    const channel = supabase
      .channel('admin-properties-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
        fetchProperties();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

  const filtered = properties.filter(p => {
    const matchesSearch = (p.title?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (p.city?.toLowerCase().includes(searchTerm.toLowerCase()));
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
          const { error } = await supabase.from('properties').delete().eq('id', id);
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
      const { error } = await supabase.from('properties').update({ isVerified: !current }).eq('id', id);
      if (error) throw error;
      setProperties(prev => prev.map(p => p.id === id ? { ...p, isVerified: !current } : p));
      toast.success(current ? 'Property unverified' : 'Property verified');
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Property Management</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Manage your listings, edit details, and track performance.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-[13px] focus:outline-none focus:border-indigo-500/20 transition-all"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto h-10 bg-white border border-gray-200 rounded-lg pl-4 pr-10 text-[13px] font-medium text-[#1A1A1A] appearance-none focus:outline-none focus:border-indigo-500/20 transition-colors cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="FOR_SALE">For Sale</option>
              <option value="FOR_RENT">For Rent</option>
              <option value="OFF_PLAN">Off Plan</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => navigate('/admin/properties/new')}
            className="w-full sm:w-auto h-10 bg-indigo-600 text-white px-5 rounded-lg items-center justify-center gap-2 text-[13px] font-bold transition-all flex"
          >
            <Plus size={16} />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden group transition-colors flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-gray-50 shrink-0">
                <img src={p.primaryImage} alt={p.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase border ${
                    p.status === 'FOR_SALE' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-[#1A1A1A] border-gray-200'
                  }`}>
                    {statusLabels[p.status]}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-[14px] font-bold text-[#1A1A1A] leading-tight line-clamp-1">{p.title}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                    <Star size={10} className="fill-current" />
                    {p.rating}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-400 mb-4">
                  <MapPin size={12} />
                  <span className="text-[11px] font-medium truncate">{p.neighborhood}, {p.city}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50 mb-auto">
                  <div className="text-center border-r border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Beds</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">{p.bedrooms}</p>
                  </div>
                  <div className="text-center border-r border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Baths</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">{p.bathrooms}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Area</p>
                    <p className="text-[13px] font-bold text-[#1A1A1A]">{p.totalArea}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                   <p className="text-[#1A1A1A] font-bold text-[16px]">
                    ${p.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => navigate(`/admin/properties/edit/${p.id}`)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[14px] text-gray-400 font-medium">No properties found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
