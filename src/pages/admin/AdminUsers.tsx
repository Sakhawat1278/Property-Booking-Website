import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserPlus, Edit3, Trash2, User as UserIcon, Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENCY' | 'USER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  created_at: string;
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-purple-50 text-purple-600 border-purple-100',
  AGENCY: 'bg-blue-50 text-blue-600 border-blue-100',
  USER: 'bg-gray-50 text-gray-600 border-gray-100',
};

const AdminUsers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('admin-users-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = profiles.filter(p => {
    const matchesSearch = 
      (p.name?.toLowerCase().includes(search.toLowerCase())) ||
      (p.email?.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This will not delete their Auth account.')) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      toast.success('Profile removed successfully');
    } catch (err: any) {
      toast.error('Failed to delete: ' + err.message);
    }
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#1A1A1A]">User Management</h1>
          <p className="text-[13px] text-gray-400 mt-1">Manage system administrators, agents, and platform users.</p>
        </div>
        <button className="h-11 px-6 bg-[#1A1A1A] text-white rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/5">
          <UserPlus size={16} />
          Add New User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 rounded-2xl text-[13px] focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'ADMIN', 'AGENCY', 'USER'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 h-11 rounded-2xl text-[12px] font-bold transition-all ${
                roleFilter === r
                  ? 'bg-brand text-white shadow-lg shadow-brand/20'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'AGENCY' ? 'Agencies / Developers' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="text-left px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="text-left px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="text-left px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="text-right px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((profile, i) => (
                <motion.tr
                  key={profile.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A]">{profile.name || 'Anonymous'}</p>
                        <p className="text-[12px] text-gray-400 font-medium">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${roleColors[profile.role]}`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-[13px] font-semibold text-gray-600">{profile.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[13px] text-gray-400 font-medium">
                      {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-brand hover:bg-brand/5 rounded-full transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <UserIcon size={40} className="mx-auto mb-4 opacity-10" />
              <p className="text-[14px] font-medium">No users found in your database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
