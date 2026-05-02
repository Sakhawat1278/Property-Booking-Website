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
const IconAward = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>;

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
  
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // ── Hardcoded Admin Credentials ─────────────────────────────────────────
  const ADMIN_EMAIL = 'hshohan1278@gmail.com';
  const ADMIN_PASSWORD = 'Sohclash123';
  // ─────────────────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setLoading(true);
    
    try {
      // Check for hardcoded admin credentials first for legacy access
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        authLogin({ id: 'admin-001', email, name: 'Admin', role: 'ADMIN' });
        toast.success('Welcome back, Admin!');
        navigate('/admin');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Welcome back!');
      
      // Check role from metadata or profile
      const userRole = data.user.user_metadata?.role || 'USER';
      if (userRole === 'ADMIN' || email === ADMIN_EMAIL) {
        navigate('/admin');
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
        navigate('/');
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

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    exit: { 
      opacity: 0, 
      y: -15,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 font-poppins overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: 'url("/login-bg.jpg")' }}
      />
      <div className="absolute inset-0 z-10 bg-black/70" />

      {/* Back to Home */}
      <button 
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-30 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center group-hover:border-brand transition-colors">
          <IconArrowLeft />
        </div>
        <span className="text-[13px] font-normal tracking-tight">Back to Home</span>
      </button>

      <div className="relative z-20 w-full flex justify-center">
        <motion.div 
          layout 
          transition={{
            layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
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
                <path d="M20 45L50 20L80 45V75C80 77.7614 77.7614 80 75 80H25C22.2386 80 20 77.7614 20 75V45Z" fill="none" stroke="#FF4D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M42 80V55H58V80" fill="none" stroke="#FF4D00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="50" cy="40" r="3" fill="#FF4D00" />
              </svg>
            </div>
            <h1 className="text-[18px] font-normal tracking-tight text-brand uppercase">Nestory</h1>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-[22px] font-medium text-[#1A1A1A] mb-1">Welcome back</h2>
                  <p className="text-gray-400 text-[13px]">Access your account</p>
                </div>



                <form className="space-y-3" onSubmit={handleLogin}>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                      <IconMail />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      required
                      className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                      <IconLock />
                    </div>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                    />
                  </div>

                  <div className="flex justify-end px-1 mb-1">
                    <button type="button" onClick={() => setMode('forgot')} className="text-[11px] font-medium text-brand hover:underline">Forgot password?</button>
                  </div>

                  <div className="flex justify-center mt-2">
                    <motion.button 
                      whileHover="shineHover"
                      disabled={loading}
                      type="submit"
                      className={`group relative h-10 bg-brand text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-4 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-[13px] font-normal">{loading ? 'Signing in...' : 'Sign in'}</span>
                      <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                        <IconArrowRight />
                      </div>
                      <motion.div
                        variants={{ shineHover: { x: '100%' } }}
                        initial={{ x: '-100%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                      />
                    </motion.button>
                  </div>
                </form>

                <p className="mt-6 text-center text-gray-400 text-[12px]">
                  New here?{' '}
                  <button onClick={() => setMode('signup')} className="font-bold text-brand hover:underline">Create account</button>
                </p>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                             <div className="mb-6">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 text-center">Account Type</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1 rounded-full border border-gray-300">
                    <button 
                      type="button"
                      onClick={() => setRole('USER')}
                      className={`h-8 rounded-full text-[11px] font-bold transition-all ${role === 'USER' ? 'bg-brand text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      Buyer
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('AGENCY')}
                      className={`h-8 rounded-full text-[11px] font-bold transition-all ${role === 'AGENCY' ? 'bg-brand text-white' : 'text-gray-400 hover:text-gray-600'}`}
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
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                        <IconPhone />
                      </div>
                      <input 
                        type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone number" 
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
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
                            className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                          />
                        </div>
                        <div className="relative col-span-2">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                            <IconMapPin />
                          </div>
                          <input 
                            type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                            placeholder="Business Address"
                            className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                            <IconShield />
                          </div>
                          <input 
                            type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="License No. (Optional)"
                            className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                          />
                        </div>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                            <IconGlobe />
                          </div>
                          <input 
                            type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                            placeholder="Website (Optional)"
                            className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className={`grid ${role === 'USER' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                        <IconMail />
                      </div>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address" 
                        required
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal" 
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                        <IconLock />
                      </div>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                        required
                        className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal" 
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mt-4">
                    <motion.button 
                      whileHover="shineHover"
                      disabled={loading}
                      type="submit"
                      className={`group relative h-10 bg-brand text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-6 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-[13px] font-normal">{loading ? 'Creating...' : 'Create Account'}</span>
                      <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                        <IconArrowRight />
                      </div>
                      <motion.div
                        variants={{ shineHover: { x: '100%' } }}
                        initial={{ x: '-100%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                      />
                    </motion.button>
                  </div>
                </form>

                <p className="mt-6 text-center text-gray-400 text-[12px]">
                  Already joined?{' '}
                  <button onClick={() => setMode('login')} className="font-bold text-brand hover:underline">Sign in</button>
                </p>
              </motion.div>
            )}

            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <button onClick={() => setMode('login')} className="flex items-center gap-2 text-brand text-[12px] font-bold mb-4 group">
                    <div className="group-hover:-translate-x-1 transition-transform scale-90"><IconArrowLeft /></div>
                    Back to Login
                  </button>
                  <h2 className="text-[22px] font-medium text-[#1A1A1A] mb-1">Reset Password</h2>
                  <p className="text-gray-400 text-[13px]">Enter your email for the link</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.info('Password reset link sent to your email.'); setMode('login'); }}>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 scale-90">
                      <IconMail />
                    </div>
                    <input type="email" placeholder="Email address" className="w-full h-10 bg-gray-50 border border-gray-300 rounded-full pl-11 pr-4 text-[13px] focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/5 outline-none transition-all placeholder:text-gray-300 font-normal" />
                  </div>

                  <div className="flex justify-center mt-2">
                    <motion.button 
                      whileHover="shineHover"
                      type="submit"
                      className="group relative h-10 bg-[#1A1A1A] text-white pl-8 pr-1 rounded-full overflow-hidden flex items-center gap-6 transition-all"
                    >
                      <span className="text-[13px] font-normal">Send Link</span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:rotate-45 scale-90">
                        <IconArrowRight />
                      </div>
                      <motion.div
                        variants={{ shineHover: { x: '100%' } }}
                        initial={{ x: '-100%' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                      />
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      {/* Sticky Footer Links */}
      <div className="fixed bottom-8 right-8 z-30 flex gap-6 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
        <a href="#" className="hover:text-brand transition-colors">Privacy</a>
        <a href="#" className="hover:text-brand transition-colors">Terms</a>
      </div>
      </div>
    </div>
  );
};

export default Login;
