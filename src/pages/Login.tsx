import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Phone, Briefcase, MapPin, ArrowRight, ArrowLeft, Globe, Shield } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

const Login = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<'USER' | 'AGENCY'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your credentials');
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Specific handling for common errors
        if (error.message === 'Invalid login credentials') {
          throw new Error('No account found with this email, or password is incorrect.');
        }
        throw error;
      }
      
      toast.success('Welcome back to Nestory!');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const userRole = profile?.role || data.user.user_metadata?.role || 'USER';
      
      if (userRole === 'ADMIN') {
        navigate('/admin');
      } else if (userRole === 'AGENCY') {
        navigate('/agency');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Required fields are missing');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            phone,
            business_name: businessName,
            address,
            verification_status: role === 'AGENCY' ? 'PENDING' : 'APPROVED'
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        toast.success('Registration successful!');
        navigate(role === 'AGENCY' ? '/agency' : '/');
      } else {
        toast.info('Verification email sent! Please check your inbox.');
        setMode('login');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-poppins overflow-hidden bg-black">
      {/* Background with Premium Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 opacity-60"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black via-black/80 to-indigo-950/40" />

      {/* Navigation */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-30 flex items-center gap-2 text-white/50 hover:text-white transition-all group"
      >
        <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
          <ArrowLeft size={14} />
        </div>
        <span className="text-[12px] font-bold tracking-widest uppercase">Portal Exit</span>
      </button>

      <div className="relative z-20 w-full flex justify-center">
        <motion.div 
          layout 
          style={{ 
            width: mode === 'login' ? 420 : role === 'USER' ? 440 : 580 
          }}
          className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-10 shadow-2xl border border-white/20"
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 mb-4 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="text-white" size={24} />
            </div>
            <h1 className="text-[14px] font-black tracking-[0.3em] text-indigo-600 uppercase">Nestory Secure</h1>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-8 text-center">
                  <h2 className="text-[28px] font-black text-black mb-2 tracking-tight">Identity Access</h2>
                  <p className="text-gray-400 text-[13px] font-medium uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Credential ID (Email)</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                      <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@nestory.com" required
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-black/10 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Security Key (Password)</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                      <input 
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" required
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none transition-all placeholder:text-black/10 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end px-4">
                    <button type="button" onClick={() => setMode('forgot')} className="text-[11px] font-black text-indigo-600 hover:opacity-70 transition-opacity uppercase tracking-widest">Forgot Access Key?</button>
                  </div>

                  <div className="pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      type="submit"
                      className={`w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Validating...' : 'Authorize Access'}
                      {!loading && <ArrowRight size={18} />}
                    </motion.button>
                  </div>
                </form>

                <p className="mt-8 text-center text-gray-400 text-[12px] font-bold uppercase tracking-widest">
                  Not in system?{' '}
                  <button onClick={() => setMode('signup')} className="text-indigo-600 hover:underline">Enroll Identity</button>
                </p>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-8">
                  <label className="block text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4 text-center">Class Assignment</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button 
                      type="button" onClick={() => setRole('USER')}
                      className={`h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'USER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      Standard Buyer
                    </button>
                    <button 
                      type="button" onClick={() => setRole('AGENCY')}
                      className={`h-10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${role === 'AGENCY' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      Professional Partner
                    </button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSignup}>
                  <div className={`grid ${role === 'USER' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Full Identity</label>
                      <div className="relative">
                        <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                        <input 
                          type="text" value={name} onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe" required
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Comm Line</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                        <input 
                          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1..."
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {role === 'AGENCY' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Business Unit</label>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                        <input 
                          type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Agency / Company Name" required
                          className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Email</label>
                      <input 
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com" required
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none font-medium" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black/30 uppercase tracking-widest ml-4">Key</label>
                      <input 
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" required
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-6 text-[14px] focus:bg-white focus:border-indigo-500 outline-none font-medium" 
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={loading}
                      type="submit"
                      className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-indigo-100"
                    >
                      {loading ? 'Processing...' : 'Request Enrollment'}
                    </motion.button>
                  </div>
                </form>

                <p className="mt-8 text-center text-gray-400 text-[12px] font-bold uppercase tracking-widest">
                  Existing Identity?{' '}
                  <button onClick={() => setMode('login')} className="text-indigo-600 hover:underline">Sign in</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
