import React from 'react';
import { 
  Settings, Globe, Shield, Bell, Database, Mail, 
  Smartphone, User, CreditCard, ChevronRight, Save
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-8 font-poppins animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-[20px] font-bold text-black">System Settings</h1>
        <p className="text-[12px] text-black/60 mt-0.5">Configure platform preferences, security protocols, and integration keys.</p>
      </div>

      <div className="space-y-6">
        {[
          {
            title: 'General Settings',
            description: 'Configure site name, logo, and contact information.',
            icon: <Globe size={18} />,
            fields: ['Site Title', 'Admin Email', 'Support Phone']
          },
          {
            title: 'Security & Access',
            description: 'Manage admin roles, password policies, and two-factor auth.',
            icon: <Shield size={18} />,
            fields: ['Admin Roles', 'Password Policy', 'Session Timeout']
          },
          {
            title: 'Email Notifications',
            description: 'Configure SMTP settings and automated email templates.',
            icon: <Mail size={18} />,
            fields: ['SMTP Configuration', 'New Lead Alerts', 'Booking Confirmations']
          },
          {
            title: 'Payment Integration',
            description: 'Manage Stripe/PayPal API keys and currency settings.',
            icon: <CreditCard size={18} />,
            fields: ['Gateway Selection', 'API Keys', 'Base Currency']
          }
        ].map((section, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-black">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-black">{section.title}</h3>
                  <p className="text-[12px] text-black/60 font-medium">{section.description}</p>
                </div>
              </div>
              <button className="h-8 px-4 bg-gray-50 hover:bg-gray-100 text-black rounded-lg text-[11px] font-bold transition-all flex items-center gap-2 border border-gray-200">
                Configure <ChevronRight size={14} />
              </button>
            </div>
            <div className="p-6 bg-gray-50/20 grid grid-cols-1 md:grid-cols-2 gap-4">
               {section.fields.map((field, fi) => (
                  <div key={fi} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                     <span className="text-[12px] font-bold text-black">{field}</span>
                     <div className="w-8 h-4 bg-gray-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                     </div>
                  </div>
               ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button className="h-10 px-6 bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Save size={16} />
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
