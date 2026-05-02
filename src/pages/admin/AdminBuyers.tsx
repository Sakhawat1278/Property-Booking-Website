import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, User, Mail, Phone, Users, Heart
} from 'lucide-react';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

const AdminBuyers: React.FC = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Local buyer state management
  }, []);

  const filtered = buyers.filter(b => 
    b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Buyer Database</h1>
          <p className="text-[13px] text-black/40 font-medium">Manage and monitor potential property investors</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/20" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Buyer Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-center">Interests</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-[13px] font-medium">
                    No buyers found matching your search
                  </td>
                </tr>
              ) : (
                filtered.map((buyer) => (
                  <tr key={buyer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-[13px]">
                          {buyer.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-black">{buyer.name}</p>
                          <p className="text-[11px] text-black/40 font-medium">Joined {new Date(buyer.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                          <Mail size={12} className="text-black/20" /> {buyer.email}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                          <Phone size={12} className="text-black/20" /> {buyer.phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-black">
                        <Heart size={14} className="text-red-400" />
                        <span className="text-[12px] font-bold">0 Saved</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="px-2 py-0.5 rounded bg-white text-black border border-gray-200 text-[9px] font-bold uppercase tracking-widest">
                         Active Investor
                       </span>
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

export default AdminBuyers;
