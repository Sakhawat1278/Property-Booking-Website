import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Lock, Camera, Save, 
  Loader2, Shield, Bell, Smartphone, Trash2,
  Briefcase, Fingerprint, RefreshCcw, Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const ProfileSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    business_name: '',
    license_number: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        business_name: user.business_name || '',
        license_number: user.license_number || '',
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          phone: formData.phone,
          business_name: formData.business_name,
          license_number: formData.license_number,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      await refreshUser();
      toast.success('Identity profile updated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      
      await refreshUser();
      toast.success('Profile image synchronized');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.newPassword) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;
      toast.success('Security credentials updated');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins text-black animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black uppercase tracking-tight">Profile Settings</h1>
          <p className="text-[12px] text-black font-medium opacity-60 mt-0.5">Manage your identity, professional details, and account security.</p>
        </div>
        <button 
          onClick={handleUpdateProfile}
          disabled={saving}
          className="h-10 px-6 bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-black/90 transition-all shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Left Card: Identity Quick View */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
             <div className="h-24 bg-gray-50 border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
             </div>
             <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center relative z-10">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 shadow-xl overflow-hidden flex items-center justify-center relative">
                    {loading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm">
                        <Loader2 className="animate-spin text-white" size={20} />
                      </div>
                    )}
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-black/10" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform shadow-lg"
                  >
                    <Camera size={12} />
                  </button>
                  <input ref={fileInputRef} type="file" onChange={handleAvatarUpload} className="hidden" accept="image/*" />
                </div>
                
                <div className="mt-4">
                   <h2 className="text-[16px] font-bold text-black">{user?.name || 'Anonymous'}</h2>
                   <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-1">{user?.role} ACCOUNT</p>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                   <div>
                      <p className="text-[15px] font-bold text-black">12</p>
                      <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">Properties</p>
                   </div>
                   <div>
                      <p className="text-[15px] font-bold text-black">4.9</p>
                      <p className="text-[9px] font-bold text-black/30 uppercase tracking-tighter">Review Score</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-black rounded-2xl p-6 text-white relative overflow-hidden group">
             <Shield className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
             <div className="relative">
                <h3 className="text-[13px] font-bold uppercase tracking-tight flex items-center gap-2">
                  <Fingerprint size={16} className="text-gray-400" />
                  Enhanced Security
                </h3>
                <p className="text-[11px] opacity-60 mt-2 leading-relaxed">Protect your administrative access by enabling Multi-Factor Authentication.</p>
                <button className="mt-4 px-4 py-2 bg-white text-black rounded-lg text-[10px] font-bold hover:bg-gray-100 transition-colors uppercase">
                  Setup MFA
                </button>
             </div>
          </div>
        </div>

        {/* Right Forms: Detailed Info */}
        <div className="xl:col-span-2 space-y-8">
           {/* Identity Information */}
           <Section 
            title="Identity Information" 
            desc="Personal and contact details" 
            icon={<User size={18} />}
            onSave={handleUpdateProfile}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Field label="Full Display Name">
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="slick-input" placeholder="e.g. John Doe" 
                    />
                 </Field>
                 <Field label="Contact Email">
                    <input 
                      value={formData.email} disabled
                      className="slick-input opacity-50 cursor-not-allowed" 
                    />
                 </Field>
                 <Field label="Phone Number">
                    <input 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="slick-input" placeholder="+1..." 
                    />
                 </Field>
                 <Field label="Primary Bio">
                    <textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="slick-input h-[46px] py-3 resize-none overflow-hidden" 
                      placeholder="Brief professional summary..."
                    />
                 </Field>
              </div>

              {user?.role === 'AGENCY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                   <Field label="Agency Name">
                      <input 
                        value={formData.business_name} 
                        onChange={e => setFormData({...formData, business_name: e.target.value})}
                        className="slick-input" placeholder="Business Name" 
                      />
                   </Field>
                   <Field label="License Number">
                      <input 
                        value={formData.license_number} 
                        onChange={e => setFormData({...formData, license_number: e.target.value})}
                        className="slick-input" placeholder="License Code" 
                      />
                   </Field>
                </div>
              )}
           </Section>

           {/* Security Settings */}
           <Section 
            title="Security & Access" 
            desc="Manage credentials and keys" 
            icon={<Key size={18} />}
            onSave={handleChangePassword}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Field label="New Password">
                    <input 
                      type="password" value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="slick-input" placeholder="••••••••" 
                    />
                 </Field>
                 <Field label="Confirm Password">
                    <input 
                      type="password" value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="slick-input" placeholder="••••••••" 
                    />
                 </Field>
              </div>
              <div className="mt-6 flex items-center gap-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                 <Shield size={14} className="text-indigo-600" />
                 <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Passwords must be at least 8 characters long</p>
              </div>
           </Section>
        </div>
      </div>

      <style>{`
        .slick-input { width: 100%; height: 46px; padding: 0 16px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; font-size: 13px; color: black; transition: all 0.2s; font-weight: 500; }
        .slick-input:focus { outline: none; border-color: #000000; box-shadow: 0 0 0 4px rgba(0,0,0,0.03); }
        .slick-input::placeholder { color: #A1A1AA; }
      `}</style>
    </div>
  );
};

const Section: React.FC<{ title: string; desc: string; icon: React.ReactNode; onSave: () => void; children: React.ReactNode }> = ({ title, desc, icon, onSave, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
       <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center">{icon}</div>
          <div>
             <h3 className="text-[14px] font-bold text-black uppercase tracking-tight">{title}</h3>
             <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{desc}</p>
          </div>
       </div>
       <button onClick={onSave} className="p-2 hover:bg-white rounded-lg transition-all text-black/20 hover:text-black border border-transparent hover:border-gray-200"><RefreshCcw size={14} /></button>
    </div>
    <div className="p-6 flex-1">{children}</div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] font-bold text-black uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default ProfileSettings;
