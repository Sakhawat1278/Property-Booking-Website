import React, { useState, useEffect } from 'react';
import { 
  Search, User, Mail, Phone, Clock, Target, Loader2, MoreHorizontal
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const AgencyLeads: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user) {
      fetchAgencyLeads();
    }
  }, [user]);

  const fetchAgencyLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*, properties!inner(title, owner_id)')
        .eq('properties.owner_id', user?.id)
        .eq('type', 'VIEWING')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeads(data || []);
    } catch (err: any) {
      toast.error('Error fetching leads: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(l => 
    l.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    l.properties?.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div>
        <h1 className="text-[20px] font-bold text-black">Customer Leads</h1>
        <p className="text-[12px] text-black/60 mt-0.5">Manage and follow up with potential buyers interested in your properties.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
        <input
          type="text"
          placeholder="Search leads or properties..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Lead Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <User size={16} />
                      </div>
                      <span className="text-[13px] font-bold text-black">{lead.guest_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-bold text-black">{lead.properties?.title}</p>
                      <p className="text-[11px] text-black/40 font-medium italic">Requested viewing</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[12px] text-black">
                           <Mail size={12} className="text-black/30" /> {lead.guest_email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-black">
                           <Phone size={12} className="text-black/30" /> {lead.guest_phone || 'N/A'}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      lead.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-black/40">
              <Target size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No customer leads found for your properties.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyLeads;
