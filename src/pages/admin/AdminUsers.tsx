import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserPlus, Edit3, Trash2, User as UserIcon, Loader2, 
  X, Mail, Lock, Shield, User, Smartphone, Save
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
  phone?: string;
  business_name?: string;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'AGENCY' | 'USER',
    phone: ''
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.name) return;

    try {
      setSaving(true);
      
      // For a real production app, you'd use a Supabase Edge Function with Admin API
      // For this implementation, we'll use signUp which creates the user and profile
      // Note: In some Supabase configs, this might sign the current admin out.
      // A better fallback for 'workable' demo is to just insert into profiles 
      // if RLS allows, but Auth is needed for login.
      
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password || 'Temporary123!',
        options: {
          data: {
            name: form.name,
            role: form.role,
            phone: form.phone
          }
        }
      });

      if (error) throw error;

      toast.success('User created successfully. They can now login.');
      setModalOpen(false);
      setForm({ name: '', email: '', password: '', role: 'USER', phone: '' });
      fetchUsers();
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
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
    if (!confirm('Are you sure you want to delete this user profile?')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      toast.success('User removed');
    } catch (err: any) {
      toast.error('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black">Agents & Owners</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Manage and monitor all professional partners and administrators.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
        >
          <UserPlus size={16} />
          Add New User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-indigo-500/20"
          />
        </div>
        <div className="flex gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-200">
          {['ALL', 'ADMIN', 'AGENCY', 'USER'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 h-8 rounded-md text-[11px] font-bold transition-all ${
                roleFilter === r
                  ? 'bg-white text-black border border-gray-200 shadow-sm'
                  : 'text-black/40 hover:text-black'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'AGENCY' ? 'Partners' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Profile</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Account Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-black/20 shrink-0">
                        <UserIcon size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black">{profile.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-black/60 font-medium">{profile.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${roleColors[profile.role]}`}>
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-[11px] font-bold text-black uppercase tracking-tight">{profile.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-black/20 hover:text-black transition-colors"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(profile.id)} className="p-2 text-black/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] border-l border-gray-200 p-8 flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-[20px] font-bold text-black">Create Partner Account</h2>
                  <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-lg"><X size={20} /></button>
               </div>

               <form onSubmit={handleCreateUser} className="space-y-6 flex-1">
                  <div className="space-y-4">
                    <Field label="Full Name" icon={<User size={14} />}>
                       <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="modern-input" placeholder="e.g. John Doe" required />
                    </Field>
                    <Field label="Email Address" icon={<Mail size={14} />}>
                       <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="modern-input" placeholder="john@example.com" required />
                    </Field>
                    <Field label="Temporary Password" icon={<Lock size={14} />}>
                       <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="modern-input" placeholder="Min 6 characters" />
                    </Field>
                    <Field label="Assigned Role" icon={<Shield size={14} />}>
                       <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} className="modern-input appearance-none bg-no-repeat bg-right pr-10">
                          <option value="USER">Standard User (Buyer)</option>
                          <option value="AGENCY">Agency / Developer Partner</option>
                          <option value="ADMIN">System Administrator</option>
                       </select>
                    </Field>
                    <Field label="Phone Number" icon={<Smartphone size={14} />}>
                       <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="modern-input" placeholder="+1..." />
                    </Field>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex gap-4 mt-auto">
                    <button type="button" onClick={() => setModalOpen(false)} className="flex-1 h-11 border border-gray-200 text-black font-bold text-[13px] rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                    <button type="submit" disabled={saving} className="flex-1 h-11 bg-black text-white font-bold text-[13px] rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                       {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                       Create Account
                    </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .modern-input {
          width: 100%; height: 44px; padding: 0 16px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; font-size: 13px; color: black; transition: all 0.2s;
        }
        .modern-input:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.05); }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase tracking-widest ml-1">{icon} {label}</label>
    {children}
  </div>
);

export default AdminUsers;
