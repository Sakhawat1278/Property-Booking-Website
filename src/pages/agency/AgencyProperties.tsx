import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, MapPin, Star, Edit3, Trash2, Loader2, Building2
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AgencyProperties: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProperties(data || []);
    } catch (err: any) {
      toast.error('Error fetching your properties: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = properties.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const { error } = await 
      if (error) throw error;
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success('Property removed successfully');
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-bold text-black">My Property Portfolio</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Manage and monitor all your active real estate listings.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
            <input
              type="text"
              placeholder="Search your listings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 bg-white border border-gray-200 rounded-lg pl-10 pr-4 text-[13px] focus:outline-none focus:border-emerald-500/20"
            />
          </div>
          <button 
            onClick={() => navigate('/agency/properties/new')}
            className="w-full sm:w-auto h-10 bg-emerald-600 text-white px-5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-emerald-700"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="relative h-44 bg-gray-100 overflow-hidden">
              <img src={p.primaryImage} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                  p.status === 'FOR_SALE' ? 'bg-emerald-600 text-white border-transparent' : 'bg-white text-black border-gray-200'
                }`}>
                  {p.status === 'FOR_SALE' ? 'Sale' : 'Rent'}
                </span>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-1.5">
                <h3 className="text-[14px] font-bold text-black line-clamp-1">{p.title}</h3>
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                  <Star size={10} className="fill-current" />
                  {p.rating || '4.5'}
                </div>
              </div>
              <div className="flex items-center gap-1 text-black/40 mb-4">
                <MapPin size={12} />
                <span className="text-[11px] font-medium truncate">{p.neighborhood}, {p.city}</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <p className="text-black font-bold text-[16px]">${p.price.toLocaleString()}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigate(`/agency/properties/edit/${p.id}`)} className="p-1.5 text-black hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-black hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-black/40">
          <Building2 size={40} className="mx-auto mb-4 opacity-10" />
          <p className="text-[14px] font-medium">You haven't added any properties yet.</p>
        </div>
      )}
    </div>
  );
};

export default AgencyProperties;
