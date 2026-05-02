import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Shield, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const AdminRegister: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    
    console.log('--- ADMIN REGISTRATION START ---');
    setLoading(true);

    try {
      console.log('Initiating signUp with shouldCreateSession: false...');
      
      // Use a race to prevent infinite hanging
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: 'ADMIN' },
          shouldCreateSession: false // This avoids the "Lock" issue entirely
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SUPABASE_HANG')), 8000)
      );

      const { data, error } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      console.log('signUp Response Received');

      if (error) {
        console.error('Registration Error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        console.log('User created. ID:', data.user.id);
        toast.success('Admin account created! Please check your email to verify (if required) then sign in.');
        navigate('/login');
      }
    } catch (err: any) {
      if (err.message === 'SUPABASE_HANG') {
        console.error('CRITICAL: Supabase signUp hung for 8s.');
        toast.error('The registration request is taking too long. Please check if the user was created in your Supabase dashboard.');
      } else {
        console.error('Registration Fatal Error:', err);
        toast.error('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.log('--- ADMIN REGISTRATION END ---');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 font-poppins">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-[32px] p-10 shadow-xl shadow-black/5 border border-gray-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/20">
            <Shield size={28} />
          </div>
          <h1 className="text-[24px] font-bold text-black tracking-tight">System Initialization</h1>
          <p className="text-[13px] text-black/40 font-medium">Create a root administrator account</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-black/40 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input 
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Admin Identity" required
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-[14px] focus:bg-white focus:border-black outline-none transition-all placeholder:text-black/10 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-black/40 uppercase tracking-widest ml-1">Work Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@nestory.com" required
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-[14px] focus:bg-white focus:border-black outline-none transition-all placeholder:text-black/10 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-black/40 uppercase tracking-widest ml-1">System Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
              <input 
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 text-[14px] focus:bg-white focus:border-black outline-none transition-all placeholder:text-black/10 font-bold"
              />
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className={`w-full h-12 bg-black text-white rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-black/10 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Authorize Admin'} <ArrowRight size={18} />
            </motion.button>
          </div>
        </form>

        <button 
          onClick={() => navigate('/login')}
          className="mt-8 flex items-center justify-center gap-2 text-[12px] font-bold text-black/40 hover:text-black transition-colors mx-auto"
        >
          <ArrowLeft size={14} /> Back to standard login
        </button>
      </motion.div>

      <div className="fixed bottom-8 text-[10px] font-bold text-black/20 uppercase tracking-[0.3em]">
        Nestory Core System v2.0
      </div>
    </div>
  );
};

export default AdminRegister;
