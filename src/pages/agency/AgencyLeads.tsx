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
        <h1 className="text-[20px] font-bold text-black uppercase tracking-tight">Inquiry Leads</h1>
        <p className="text-[12px] text-black font-medium opacity-60 mt-0.5">Manage and follow up with potential buyers interested in your properties.</p>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
        <input
          type="text"
          placeholder="Search leads or properties..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-black transition-all placeholder:text-black/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Lead Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property Inquired</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Received</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-black shrink-0">
                        <User size={16} />
                      </div>
                      <span className="text-[13px] font-bold text-black">{lead.guest_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-[12px] text-black font-medium">
                           <Mail size={12} className="text-black/20" /> {lead.guest_email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-black font-medium">
                           <Phone size={12} className="text-black/20" /> {lead.guest_phone || 'N/A'}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       <span className="text-[13px] font-bold text-black">{lead.properties?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      lead.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-bold">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-black/10 hover:text-black transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-32 text-center text-black/20">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mx-auto mb-4">
                 <Target size={24} className="opacity-40" />
              </div>
              <p className="text-[13px] font-bold text-black/40 uppercase tracking-widest">No inquiry leads found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyLeads;
