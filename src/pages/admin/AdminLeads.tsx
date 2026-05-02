import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreHorizontal, User, Mail, Phone, Calendar,
  ArrowUpRight, Clock, CheckCircle2, XCircle, Loader2, Target
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Lead {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  status: string;
  created_at: string;
  property_title?: string;
}

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLeads();
    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => fetchLeads())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Leads are 'VIEWING' type requests
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (title)
        `)
        .eq('type', 'VIEWING')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formatted = data.map((item: any) => ({
        ...item,
        property_title: item.properties?.title
      }));
      
      setLeads(formatted);
    } catch (err: any) {
      toast.error('Error fetching leads: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(l => 
    l.guest_name.toLowerCase().includes(search.toLowerCase()) ||
    l.guest_email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && leads.length === 0) {
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
          <h1 className="text-[20px] font-bold text-black">Inquiry Leads</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Track and manage potential buyers inquiring about properties.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by name or email..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Lead Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property Inquired</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Received</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                        <User size={16} />
                      </div>
                      <span className="text-[13px] font-bold text-black">{lead.guest_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-black">
                        <Mail size={12} className="text-gray-400" />
                        {lead.guest_email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[12px] text-black">
                        <Phone size={12} className="text-gray-400" />
                        {lead.guest_phone || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span className="text-[13px] text-black font-medium">{lead.property_title || 'Unknown Property'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      lead.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      lead.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' :
                      'bg-gray-50 text-gray-400 border-gray-100'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-medium">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-black transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <Target size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No inquiry leads found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
