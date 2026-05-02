import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserPlus, Edit3, Trash2, User as UserIcon, Loader2, ChevronRight
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
  ADMIN: 'bg-indigo-50 text-indigo-600 border-indigo-100',
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
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">User Management</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">Manage system administrators, agents, and platform users.</p>
        </div>
        <button className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <UserPlus size={16} />
          Add New User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-100 rounded-lg text-[13px] focus:outline-none focus:border-indigo-500/20 transition-all placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2 bg-gray-50/50 p-1 rounded-lg border border-gray-100">
          {['ALL', 'ADMIN', 'AGENCY', 'USER'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 h-8 rounded-md text-[11px] font-bold transition-all ${
                roleFilter === r
                  ? 'bg-white text-[#1A1A1A] border border-gray-100'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'AGENCY' ? 'Agencies' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-[#1A1A1A]">{profile.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${roleColors[profile.role]}`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-[12px] font-semibold text-gray-600">{profile.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] text-gray-400 font-medium">
                      {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(profile.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <UserIcon size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No users found in your database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
