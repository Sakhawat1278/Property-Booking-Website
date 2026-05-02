import React, { useState, useEffect } from 'react';
import { 
  Building2, Globe, Shield, Mail, Phone, MapPin, 
  Save, Loader2, Camera, ExternalLink, Briefcase, Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import { toast } from 'sonner';

const AgencySettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    address: '',
    license_number: '',
    website: '',
    experience: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setInitialLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          business_name: data.business_name || '',
          address: data.address || '',
          license_number: data.license_number || '',
          website: data.website || '',
          experience: data.experience || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (err: any) {
      console.error('Fetch profile error:', err.message);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Agency profile updated successfully');
    } catch (err: any) {
      toast.error('Update failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 font-poppins animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-[20px] font-bold text-black">Agency Profile</h1>
        <p className="text-[12px] text-black/60 mt-0.5">Manage your agency brand, contact information, and business credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Branding */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
               <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.avatar_url ? (
                    <img src={formData.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={32} className="text-black/20" />
                  )}
               </div>
               <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera size={14} />
               </button>
            </div>
            <h3 className="text-[15px] font-bold text-black">{formData.business_name || 'Agency Name'}</h3>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Verified Partner</p>
          </div>

          <div className="bg-emerald-600 rounded-xl p-6 text-white">
             <Award size={24} className="mb-4 opacity-50" />
             <h4 className="text-[14px] font-bold mb-1">Premier Developer</h4>
             <p className="text-white/70 text-[11px] leading-relaxed">Your agency is currently ranked in the top 5% for response time and listing quality.</p>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
               <h3 className="text-[14px] font-bold text-black">Business Information</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Agency / Business Name">
                  <input 
                    value={formData.business_name} 
                    onChange={e => setFormData({...formData, business_name: e.target.value})} 
                    className="modern-input" placeholder="e.g. Skyline Properties" 
                  />
                </Field>
                <Field label="License Number">
                  <input 
                    value={formData.license_number} 
                    onChange={e => setFormData({...formData, license_number: e.target.value})} 
                    className="modern-input" placeholder="e.g. RE-2025-001" 
                  />
                </Field>
              </div>

              <Field label="Official Website">
                <div className="relative">
                   <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                   <input 
                    value={formData.website} 
                    onChange={e => setFormData({...formData, website: e.target.value})} 
                    className="modern-input pl-10" placeholder="https://youragency.com" 
                   />
                </div>
              </Field>

              <Field label="Business Address">
                <div className="relative">
                   <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                   <input 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="modern-input pl-10" placeholder="Full office address..." 
                   />
                </div>
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/30">
               <h3 className="text-[14px] font-bold text-black">Contact & Support</h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Primary Contact Name">
                  <input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="modern-input" placeholder="Point of contact" 
                  />
                </Field>
                <Field label="Public Phone Number">
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" />
                    <input 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                      className="modern-input pl-10" placeholder="+1 234 567 890" 
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="h-11 px-8 bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modern-input {
          width: 100%;
          height: 40px;
          padding: 0 16px;
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 13px;
          color: black;
          transition: all 0.2s;
        }
        .modern-input:focus {
          outline: none;
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05);
        }
      `}</style>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest ml-1">{label}</label>
    {children}
  </div>
);

export default AgencySettings;
