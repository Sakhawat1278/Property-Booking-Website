import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { 
  Mail, Lock, ArrowRight, Building2, User, Loader2, 
  ShieldCheck, ArrowLeft, Eye, EyeOff
} from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'AGENCY') navigate('/agency');
      else navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    console.log('--- LOGIN ATTEMPT START ---');
    console.log('Target Email:', email);
    setLoading(true);

    try {
      // 1. Connection check ping
      try {
        const { error: pingError } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).limit(1);
        if (pingError && pingError.message.includes('Failed to fetch')) {
           throw new Error('Supabase unreachable');
        }
      } catch (e) {
        console.error('Connection Check Failed:', e);
        setLoading(false);
        toast.error('Network Error: Cannot connect to Supabase.');
        return;
      }

      // 2. Perform Sign In with Timeout Race
      console.log('Calling supabase.auth.signInWithPassword...');
      
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AUTH_TIMEOUT')), 8000)
      );

      const { data, error } = await Promise.race([signInPromise, timeoutPromise]) as any;

      console.log('signIn Response Received:', { hasData: !!data, hasUser: !!data?.user, hasError: !!error });

      if (error) {
        console.error('Auth Error:', error);
        if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email address first.');
        } else {
          toast.error(error.message || 'Invalid email or password');
        }
        return;
      }

      if (data?.user) {
        toast.success('Welcome back!');
        // Role-based routing is handled by the useEffect above
      }
    } catch (err: any) {
      if (err.message === 'AUTH_TIMEOUT') {
        console.error('CRITICAL: Sign-in request hung for 8s.');
        toast.error('The sign-in request is taking too long. Please refresh and try again.');
      } else {
        console.error('Login Fatal Error:', err);
        toast.error('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
      console.log('--- LOGIN ATTEMPT END ---');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-poppins overflow-hidden">
      {/* Left side - Visual branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[120px]" />
        
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-black" />
          </div>
          <span className="text-white font-bold text-[24px] tracking-tight">Nestory</span>
        </Link>

        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[42px] font-bold text-white leading-[1.1] mb-6"
          >
            Manage the future of <br />
            <span className="text-emerald-400">luxury real estate.</span>
          </motion.h2>
          <p className="text-white/40 text-[16px] font-medium max-w-md">
            The world's most advanced platform for property agencies and root administrators.
          </p>
        </div>

        <div className="relative z-10 flex gap-8">
           <div className="flex flex-col">
              <span className="text-[24px] font-bold text-white">5k+</span>
              <span className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Active Listings</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[24px] font-bold text-white">200+</span>
              <span className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Global Partners</span>
           </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 bg-white">
        <div className="max-w-[420px] w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-[32px] font-bold text-black tracking-tight mb-2">Welcome Back</h1>
            <p className="text-black/40 text-[14px] font-medium">Please enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-black/40 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 text-[14px] font-bold text-black focus:bg-white focus:border-black outline-none transition-all placeholder:text-black/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-black/40 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[11px] font-bold text-emerald-600 hover:underline">Forgot password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 text-[14px] font-bold text-black focus:bg-white focus:border-black outline-none transition-all placeholder:text-black/10"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className={`w-full h-14 bg-emerald-500 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-[13px] font-medium text-black/40">
              Need specialized access? <Link to="/admin-register-root-init" className="text-black font-bold hover:underline">Request Identity</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
