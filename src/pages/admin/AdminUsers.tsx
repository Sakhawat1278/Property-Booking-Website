import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Edit3, Trash2, User as UserIcon, 
  X, Mail, Shield, User, Smartphone, Building2
} from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    // Local state management here
  }, []);

  const filtered = profiles.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">System Users</h1>
          <p className="text-[13px] text-black/40 font-medium">Manage agents, owners, and administrators</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="h-10 px-6 bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-gray-900 transition-all shadow-lg shadow-black/10"
        >
          <UserPlus size={18} /> Add User
        </button>
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
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Contact</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-black/40 text-[13px] font-medium">
                    No users found matching your search criteria
                  </td>
                </tr>
              ) : (
                filtered.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black font-bold text-[13px]">
                          {profile.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-black">{profile.name}</p>
                          <p className="text-[11px] text-black/40 font-medium">Joined {new Date(profile.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                        profile.role === 'ADMIN' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
                      }`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                          <Mail size={12} className="text-black/20" /> {profile.email}
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-2 text-[12px] font-medium text-black">
                            <Smartphone size={12} className="text-black/20" /> {profile.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-black/5 text-black/40 hover:text-black transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-black/40 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default AdminUsers;
