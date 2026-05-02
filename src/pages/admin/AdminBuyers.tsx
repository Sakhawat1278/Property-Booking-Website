import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, User, Mail, Phone, Calendar, Loader2, Users, MapPin, Heart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

const AdminBuyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'USER')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBuyers(data || []);
    } catch (err: any) {
      toast.error('Error fetching buyers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = buyers.filter(b => 
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && buyers.length === 0) {
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
          <h1 className="text-[20px] font-bold text-black">Buyer Database</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Manage registered users who are looking to buy or rent properties.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search buyers by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-indigo-500/20 transition-all placeholder:text-gray-300"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Buyer Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Saved Listings</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-gray-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <User size={16} />
                      </div>
                      <span className="text-[13px] font-bold text-black">{buyer.name || 'Anonymous Buyer'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="text-[12px] text-black">{buyer.email}</div>
                      <div className="text-[12px] text-black/50">{buyer.phone || 'No phone provided'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-black">
                      <Heart size={14} className="text-red-400" />
                      <span className="text-[13px] font-semibold">0 <span className="text-[11px] font-normal text-black/40 italic">saved</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-medium">
                    {new Date(buyer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No buyers found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBuyers;
