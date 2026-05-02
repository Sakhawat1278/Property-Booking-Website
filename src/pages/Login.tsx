import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// Inline SVG Components for compatibility
const IconArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IconArrowRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const IconMail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IconLock = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconPhone = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconBriefcase = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconMapPin = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconShield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>;
const IconGlobe = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>;

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
  const [licenseNumber, setLicenseNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Welcome back!');
      
      // Fetch profile to determine redirect
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
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error('Please fill in all required fields');
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
            license_number: licenseNumber,
            website,
            experience
          }
        }
      });

      if (error) throw error;
      
      if (data.session) {
        toast.success('Account created successfully!');
        if (role === 'AGENCY') {
           navigate('/agency');
        } else {
           navigate('/');
        }
      } else {
        toast.info('Please check your email for the verification link');
        setMode('login');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-poppins overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
      />
      <div className="absolute inset-0 z-10 bg-black/70" />

      {/* Back to Home */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-30 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
          <IconArrowLeft />
        </div>
        <span className="text-[13px] font-normal tracking-tight text-white">Back to Home</span>
      </button>

      <div className="relative z-20 w-full flex justify-center">
        <motion.div 
          layout 
          style={{ 
            width: mode === 'login' ? 380 : 
                   mode === 'forgot' ? 380 :
                   role === 'USER' ? 400 : 550 
          }}
          className="bg-white rounded-[32px] p-8 border border-gray-100 overflow-hidden"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 mb-2">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M20 45L50 20L80 45V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V45Z" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M42 80V55H58V80" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="50" cy="40" r="3" fill="#10b981" />
              </svg>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-emerald-600 uppercase">Nestory</h1>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-1">Welcome back</h2>
                  <p className="text-gray-400 text-[13px]">Access your account</p>
                </div>

                <form className="space-y-3" onSubmit={handleLogin}>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                      <IconMail />
                    </div>
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address" required
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                      <IconLock />
                    </div>
                    <input 
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" required
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                    />
                  </div>

                  <div className="flex justify-end px-1">
                    <button type="button" onClick={() => setMode('forgot')} className="text-[11px] font-bold text-emerald-600 hover:underline">Forgot password?</button>
                  </div>

                  <div className="flex justify-center mt-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      type="submit"
                      className={`group relative h-11 bg-emerald-600 text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-4 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-[13px] font-bold">{loading ? 'Signing in...' : 'Sign in'}</span>
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                        <IconArrowRight />
                      </div>
                    </motion.button>
                  </div>
                </form>

                <p className="mt-6 text-center text-gray-400 text-[12px]">
                  New here?{' '}
                  <button onClick={() => setMode('signup')} className="font-bold text-emerald-600 hover:underline">Create account</button>
                </p>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center">Account Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-full border border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`h-8 rounded-full text-[10px] font-bold transition-all ${role === 'USER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      Buyer
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('AGENCY')}
                      className={`h-8 rounded-full text-[10px] font-bold transition-all ${role === 'AGENCY' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                    >
                      Agency / Developer
                    </button>
                  </div>
                </div>

                <form className="space-y-3" onSubmit={handleSignup}>
                  <div className={`grid ${role === 'USER' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                        <IconUser />
                      </div>
                      <input 
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Full name" required
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                        <IconPhone />
                      </div>
                      <input 
                        type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number" 
                        className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                      />
                    </div>

                    {role === 'AGENCY' && (
                      <>
                        <div className="relative col-span-2">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                            <IconBriefcase />
                          </div>
                          <input 
                            type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Agency / Company Name"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                          />
                        </div>
                        <div className="relative col-span-2">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                            <IconMapPin />
                          </div>
                          <input 
                            type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                            placeholder="Business Address"
                            className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`grid ${role === 'USER' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    <input 
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address" required
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full px-5 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300" 
                    />
                    <input 
                      type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password" required
                      className="w-full h-11 bg-gray-50 border border-gray-200 rounded-full px-5 text-[13px] focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300" 
                    />
                  </div>

                  <div className="flex justify-center mt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      type="submit"
                      className="group relative h-11 bg-emerald-600 text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-6"
                    >
                      <span className="text-[13px] font-bold">Create Account</span>
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white scale-90">
                        <IconArrowRight />
                      </div>
                    </motion.button>
                  </div>
                </form>

                <p className="mt-6 text-center text-gray-400 text-[12px]">
                  Already joined?{' '}
                  <button onClick={() => setMode('login')} className="font-bold text-emerald-600 hover:underline">Sign in</button>
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
