import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Bed, Bath, Star, Edit3, Trash2, Plus
} from 'lucide-react';
import { properties as allProperties } from '../../data/properties';
import { useNavigate } from 'react-router-dom';

const statusLabels: Record<string, string> = {
  FOR_SALE: 'For Sale',
  FOR_RENT: 'For Rent',
  OFF_PLAN: 'Off Plan',
};

const AdminProperties: React.FC = () => {
  const [properties, setProperties] = useState<any[]>(allProperties);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Local state is already initialized with allProperties
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Property Portfolio</h1>
          <p className="text-[13px] text-black/40 font-medium">Manage and monitor all platform listings</p>
        </div>
        <button 
          onClick={() => navigate('/admin/properties/new')}
          className="h-10 px-6 bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-gray-900 transition-all shadow-lg shadow-black/10"
        >
          <Plus size={18} /> New Listing
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-[13px] focus:bg-white focus:border-black outline-none transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            {['ALL', 'FOR_SALE', 'FOR_RENT', 'OFF_PLAN'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 h-10 rounded-xl text-[12px] font-bold transition-all border ${
                  statusFilter === status 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-gray-100 hover:border-gray-200'
                }`}
              >
                {status === 'ALL' ? 'All' : statusLabels[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-center">Stats</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={property.images?.[0] || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black leading-tight mb-1">{property.title}</p>
                        <div className="flex items-center gap-1.5 text-black/40">
                          <MapPin size={12} />
                          <span className="text-[11px] font-medium">{property.city}</span>
                        </div>
                        <p className="text-[12px] font-bold text-black mt-1.5">${property.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex items-center gap-1 text-black/40">
                        <Bed size={14} />
                        <span className="text-[12px] font-bold text-black">{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1 text-black/40">
                        <Bath size={14} />
                        <span className="text-[12px] font-bold text-black">{property.baths}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      property.status === 'FOR_SALE' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
                    }`}>
                      {statusLabels[property.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/admin/properties/edit/${property.id}`)}
                        className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-black/40 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
