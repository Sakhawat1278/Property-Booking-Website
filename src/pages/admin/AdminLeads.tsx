import React, { useState, useEffect } from 'react';
import { 
  Search, User, Mail, Phone, Clock, Target, MoreHorizontal
} from 'lucide-react';

import { toast } from 'sonner';

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Lead fetching logic would go here
  }, []);

  const filtered = leads.filter(l => 
    l.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.properties?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Active Leads</h1>
          <p className="text-[13px] text-black/40 font-medium">Manage and track property viewing requests</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 text-[13px] focus:bg-white focus:border-black outline-none transition-all font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Lead Detail</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-[13px] font-medium">
                    No active leads found matching your search
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-[13px]">
                          {lead.guest_name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-black">{lead.guest_name}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase">
                            <Clock size={10} /> {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                          <Mail size={12} className="text-black/20" /> {lead.guest_email}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                          <Phone size={12} className="text-black/20" /> {lead.guest_phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-black">
                        <Target size={14} className="text-black/20" />
                        {lead.properties?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-black/5 transition-colors text-black/40 hover:text-black">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
