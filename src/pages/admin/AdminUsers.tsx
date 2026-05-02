import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, UserPlus, Edit3, Trash2, User as UserIcon, Loader2, 
  X, Mail, Lock, Shield, User, Smartphone, Save, Building2, Globe, Award
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
}

const roleColors: Record<string, string> = {
  ADMIN: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  AGENCY: 'bg-emerald-50 text-emerald-600 border-emerald-100',
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
    phone: '',
    business_name: '',
    license_number: '',
    website: ''
  });

  useEffect(() => {
    fetchUsers();
    const channel = supabase
      .channel('admin-users-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchUsers())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
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
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password || 'TempPass123!',
        options: {
          data: {
            name: form.name,
            role: form.role,
            phone: form.phone,
            business_name: form.business_name,
            license_number: form.license_number,
            website: form.website
          }
        }
      });

      if (error) throw error;
      toast.success(`${form.role} account created successfully!`);
      setModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '', email: '', password: '', role: 'USER',
      phone: '', business_name: '', license_number: '', website: ''
    });
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
          <h1 className="text-[20px] font-bold text-black">Account Management</h1>
          <p className="text-[12px] text-black/60 mt-0.5">Oversee and manage access for all system roles.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="h-9 px-4 bg-black text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-gray-900 transition-all shadow-sm"
        >
          <UserPlus size={16} />
          Create New Account
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-black/10 transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-200">
          {['ALL', 'ADMIN', 'AGENCY', 'USER'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 h-8 rounded-md text-[11px] font-bold transition-all ${
                roleFilter === r ? 'bg-white text-black border border-gray-200 shadow-sm' : 'text-black/40 hover:text-black'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'AGENCY' ? 'Agencies' : r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Identitiy</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-black/10 shrink-0">
                        <UserIcon size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black">{profile.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-black/50 font-medium">{profile.email}</p>
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
                      <span className="text-[11px] font-bold text-black uppercase">{profile.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-black/20 hover:text-black"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(profile.id)} className="p-2 text-black/20 hover:text-red-500"><Trash2 size={14} /></button>
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
               <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <h2 className="text-[20px] font-bold text-black">Add New Account</h2>
                    <p className="text-[11px] text-black/40 font-bold uppercase tracking-wider">Configure role-based access</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-black/40 hover:text-black">
                    <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleCreateUser} className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-[11px] font-bold text-black/40 uppercase tracking-widest mb-3 ml-1">Select Account Type</label>
                       <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-xl">
                          {(['USER', 'AGENCY', 'ADMIN'] as const).map(r => (
                            <button
                              key={r} type="button"
                              onClick={() => setForm({...form, role: r})}
                              className={`h-9 rounded-lg text-[12px] font-bold transition-all ${form.role === r ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'}`}
                            >
                              {r === 'AGENCY' ? 'Agency Partner' : r === 'USER' ? 'Buyer/User' : 'Administrator'}
                            </button>
                          ))}
                       </div>
                    </div>

                    <Field label="Full Name" icon={<User size={14} />} required>
                       <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="modern-input" placeholder="e.g. Michael Chen" required />
                    </Field>
                    <Field label="Email Address" icon={<Mail size={14} />} required>
                       <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="modern-input" placeholder="michael@example.com" required />
                    </Field>
                    <Field label="Temporary Password" icon={<Lock size={14} />} required>
                       <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="modern-input" placeholder="Min 6 chars" required />
                    </Field>
                    <Field label="Phone Number" icon={<Smartphone size={14} />}>
                       <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="modern-input" placeholder="+1..." />
                    </Field>

                    <AnimatePresence mode="wait">
                      {form.role === 'AGENCY' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                           <Field label="Business Name" icon={<Building2 size={14} />} required>
                              <input value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} className="modern-input" placeholder="e.g. Skyline Realty" required />
                           </Field>
                           <Field label="License Number" icon={<Award size={14} />}>
                              <input value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} className="modern-input" placeholder="RE-2025-XXXX" />
                           </Field>
                           <div className="md:col-span-2">
                              <Field label="Official Website" icon={<Globe size={14} />}>
                                 <input value={form.website} onChange={e => setForm({...form, website: e.target.value})} className="modern-input" placeholder="https://..." />
                              </Field>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex gap-4 justify-end">
                    <button type="button" onClick={() => setModalOpen(false)} className="h-11 px-8 text-black font-bold text-[13px] hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                    <button type="submit" disabled={saving} className="h-11 px-10 bg-black text-white font-bold text-[13px] rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                       {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                       Publish Account
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .modern-input { width: 100%; height: 44px; padding: 0 16px; background: white; border: 1px solid #F3F4F6; border-radius: 12px; font-size: 13px; color: black; transition: all 0.2s; }
        .modern-input:focus { outline: none; border-color: #000000; box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05); }
        .modern-input::placeholder { color: #D1D5DB; }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; icon: React.ReactNode; required?: boolean; children: React.ReactNode }> = ({ label, icon, required, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-[10px] font-bold text-black/40 uppercase tracking-widest ml-1">
      {icon} {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

export default AdminUsers;
