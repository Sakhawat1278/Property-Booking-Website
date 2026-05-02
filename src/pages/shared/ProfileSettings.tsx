import React, { useState, useRef } from 'react';
import { 
  User, Mail, Lock, Camera, Save, 
  Loader2, Shield, Bell, Smartphone, Trash2
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
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    business_name: user?.business_name || '',
    license_number: user?.license_number || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success('Profile updated successfully');
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
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

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
      toast.success('Avatar updated');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">Profile Settings</h1>
          <p className="text-[13px] text-black/50 font-medium">Manage your personal identity, professional details, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-50 to-transparent" />
            
            <div className="relative group mt-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center relative">
                {loading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-black/10" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform shadow-lg cursor-pointer"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="mt-6 space-y-1 relative">
              <h2 className="text-[18px] font-bold text-black">{user?.name}</h2>
              <p className="text-[12px] font-bold text-black opacity-40 uppercase tracking-widest">{user?.role}</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
               <div className="text-center">
                  <p className="text-[16px] font-bold text-black">12</p>
                  <p className="text-[10px] font-bold text-black/30 uppercase">Listings</p>
               </div>
               <div className="text-center">
                  <p className="text-[16px] font-bold text-black">4.9</p>
                  <p className="text-[10px] font-bold text-black/30 uppercase">Rating</p>
               </div>
            </div>
          </div>

          <div className="bg-black text-white rounded-3xl p-6 relative overflow-hidden group">
            <Shield className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative">
              <h3 className="text-[14px] font-bold uppercase tracking-tight mb-2">Two-Factor Auth</h3>
              <p className="text-[11px] opacity-60 font-medium leading-relaxed mb-4">Enhance your account security by enabling second-factor verification.</p>
              <button className="px-4 py-2 bg-white text-black rounded-xl text-[11px] font-bold hover:bg-gray-100 transition-colors">
                Setup MFA
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <section className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center"><User size={18} /></div>
                  <h3 className="text-[15px] font-bold text-black uppercase tracking-tight">Personal Information</h3>
               </div>
               <button 
                onClick={handleUpdateProfile} 
                disabled={saving}
                className="px-4 py-2 bg-black text-white rounded-xl text-[12px] font-bold hover:bg-black/90 transition-all flex items-center gap-2"
               >
                {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Save Profile
               </button>
            </div>
            
            <div className="p-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Display Name">
                    <input 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="slick-input" placeholder="e.g. John Doe" 
                    />
                  </Field>
                  <Field label="Contact Email (Primary)">
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
                  <Field label="Professional Title">
                    <input 
                      value={user?.role === 'ADMIN' ? 'Platform Administrator' : 'Certified Real Estate Agent'} 
                      disabled className="slick-input opacity-50 cursor-not-allowed" 
                    />
                  </Field>
               </div>

               {user?.role === 'AGENCY' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-500">
                    <Field label="Agency / Business Name">
                      <input 
                        value={formData.business_name} 
                        onChange={e => setFormData({...formData, business_name: e.target.value})}
                        className="slick-input" placeholder="e.g. Nestory Elite Properties" 
                      />
                    </Field>
                    <Field label="Trade License Number">
                      <input 
                        value={formData.license_number} 
                        onChange={e => setFormData({...formData, license_number: e.target.value})}
                        className="slick-input" placeholder="e.g. LUX-1234567" 
                      />
                    </Field>
                 </div>
               )}

               <div className="mt-6">
                  <Field label="Professional Bio">
                    <textarea 
                      value={formData.bio} 
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="slick-input h-32 py-3 resize-none" 
                      placeholder="Write a short biography about your experience..."
                    />
                  </Field>
               </div>
            </div>
          </section>

          {/* Security & Password */}
          <section className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><Lock size={18} /></div>
                  <h3 className="text-[15px] font-bold text-black uppercase tracking-tight">Security & Password</h3>
               </div>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="New Password">
                    <input 
                      type="password" value={passwordData.newPassword}
                      onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="slick-input" placeholder="••••••••" 
                    />
                  </Field>
                  <Field label="Confirm New Password">
                    <input 
                      type="password" value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="slick-input" placeholder="••••••••" 
                    />
                  </Field>
               </div>
               <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest">Last changed: Never</p>
                  <button 
                    type="submit" disabled={saving}
                    className="h-11 px-8 bg-black text-white rounded-xl text-[13px] font-bold hover:bg-black/90 transition-all flex items-center gap-2"
                  >
                    Update Security
                  </button>
               </div>
            </form>
          </section>
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

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-bold text-black uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default ProfileSettings;
