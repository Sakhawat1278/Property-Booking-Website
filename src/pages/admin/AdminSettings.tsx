import React, { useState, useEffect } from 'react';
import { 
  Globe, Shield, Mail, CreditCard, ChevronRight, Save, 
  Loader2, CheckCircle2, AlertCircle, RefreshCcw
} from 'lucide-react';

import { toast } from 'sonner';

import { useAuth } from '../../context/AuthContext';

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    general: { admin_email: '', support_phone: '' },
    security: { mfa_enabled: false, password_policy: 'STANDARD', session_timeout: '1h' },
    notifications: { email_alerts: true, booking_confirmations: true, lead_notifications: true },
    payments: { currency: 'USD', gateway: 'STRIPE', api_key: '', tax_rate: '0' }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await 
      if (error) throw error;

      const mergedSettings = { ...settings };
      // Default email to current user if nothing is in DB
      mergedSettings.general.admin_email = user?.email || '';

      data?.forEach(item => {
        if (mergedSettings[item.key]) {
          mergedSettings[item.key] = { ...mergedSettings[item.key], ...item.value };
        }
      });
      setSettings(mergedSettings);
    } catch (err: any) {
      console.error('Error fetching settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('system_settings')
        .upsert({ key, value: settings[key], updated_at: new Date().toISOString() });
      
      if (error) throw error;
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} settings updated`);
    } catch (err: any) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    try {
      setSaving(true);
      const promises = Object.keys(settings).map(key => 
        
      );
      await Promise.all(promises);
      toast.success('All system settings synchronized');
    } catch (err: any) {
      toast.error('Sync failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-poppins text-black animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black uppercase tracking-tight">System Configuration</h1>
          <p className="text-[12px] text-black font-medium opacity-60 mt-0.5">Control global platform behavior, security protocols, and third-party integrations.</p>
        </div>
        <button 
          onClick={saveAll}
          disabled={saving}
          className="h-10 px-6 bg-black text-white rounded-xl text-[13px] font-bold flex items-center gap-2 hover:bg-black/90 transition-all shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* General Settings */}
        <Section 
          title="General Settings" 
          desc="Site branding and contact points" 
          icon={<Globe size={18} />}
          onSave={() => handleSave('general')}
        >
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <Field label="Admin Email">
                  <input 
                    type="email" value={settings.general.admin_email} 
                    onChange={e => setSettings({...settings, general: {...settings.general, admin_email: e.target.value}})}
                    className="slick-input" placeholder="admin@nestory.com" 
                  />
                </Field>
                <Field label="Support Phone">
                  <input 
                    value={settings.general.support_phone} 
                    onChange={e => setSettings({...settings, general: {...settings.general, support_phone: e.target.value}})}
                    className="slick-input" placeholder="+1..." 
                  />
                </Field>
             </div>
          </div>
        </Section>

        {/* Security & Access */}
        <Section 
          title="Security & Access" 
          desc="Platform safety and session policies" 
          icon={<Shield size={18} />}
          onSave={() => handleSave('security')}
        >
          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                   <p className="text-[13px] font-bold text-black">Two-Factor Authentication</p>
                   <p className="text-[11px] text-black/50 font-bold uppercase tracking-tighter">Requires MFA for all admins</p>
                </div>
                <Toggle 
                  active={settings.security.mfa_enabled} 
                  onClick={() => setSettings({...settings, security: {...settings.security, mfa_enabled: !settings.security.mfa_enabled}})} 
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <Field label="Password Policy">
                   <select 
                    value={settings.security.password_policy}
                    onChange={e => setSettings({...settings, security: {...settings.security, password_policy: e.target.value}})}
                    className="slick-input appearance-none"
                   >
                      <option value="STANDARD">Standard</option>
                      <option value="STRICT">Strict (12+ chars)</option>
                   </select>
                </Field>
                <Field label="Session Timeout">
                   <select 
                    value={settings.security.session_timeout}
                    onChange={e => setSettings({...settings, security: {...settings.security, session_timeout: e.target.value}})}
                    className="slick-input appearance-none"
                   >
                      <option value="30m">30 Minutes</option>
                      <option value="1h">1 Hour</option>
                      <option value="24h">24 Hours</option>
                   </select>
                </Field>
             </div>
          </div>
        </Section>

        {/* Notifications */}
        <Section 
          title="Notifications" 
          desc="Automated alerts and email triggers" 
          icon={<Mail size={18} />}
          onSave={() => handleSave('notifications')}
        >
           <div className="space-y-3">
              {[
                { label: 'System Email Alerts', key: 'email_alerts' },
                { label: 'Booking Confirmations', key: 'booking_confirmations' },
                { label: 'New Lead Notifications', key: 'lead_notifications' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-black/10 transition-all">
                   <span className="text-[12px] font-bold text-black">{item.label}</span>
                   <Toggle 
                     active={settings.notifications[item.key]} 
                     onClick={() => setSettings({...settings, notifications: {...settings.notifications, [item.key]: !settings.notifications[item.key]}})} 
                   />
                </div>
              ))}
           </div>
        </Section>

        {/* Payments */}
        <Section 
          title="Payment Gateway" 
          desc="Stripe integration and currency" 
          icon={<CreditCard size={18} />}
          onSave={() => handleSave('payments')}
        >
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Base Currency">
                   <select 
                    value={settings.payments.currency}
                    onChange={e => setSettings({...settings, payments: {...settings.payments, currency: e.target.value}})}
                    className="slick-input appearance-none"
                   >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                   </select>
                </Field>
                <Field label="Platform Tax Rate (%)">
                   <input 
                    type="number" value={settings.payments.tax_rate || ''} 
                    onChange={e => setSettings({...settings, payments: {...settings.payments, tax_rate: e.target.value}})}
                    className="slick-input" placeholder="0" 
                   />
                </Field>
              </div>
              <Field label="Stripe API Key (Production)">
                 <input 
                    type="password" value={settings.payments.api_key || ''} 
                    onChange={e => setSettings({...settings, payments: {...settings.payments, api_key: e.target.value}})}
                    className="slick-input" placeholder="sk_live_..." 
                 />
              </Field>
           </div>
        </Section>
      </div>

      <style>{`
        .slick-input { width: 100%; height: 42px; padding: 0 16px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; font-size: 13px; color: black; transition: all 0.2s; font-weight: 500; }
        .slick-input:focus { outline: none; border-color: #000000; }
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

const Toggle: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-black' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
  </button>
);

export default AdminSettings;
