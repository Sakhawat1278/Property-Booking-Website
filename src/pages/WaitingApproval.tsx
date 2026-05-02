import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, Mail, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const WaitingApproval: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 font-poppins flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden"
      >
        <div className="h-2 bg-black w-full" />
        
        <div className="p-10 flex flex-col items-center text-center">
           <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 relative">
              <Clock size={40} className="text-black" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                 <ShieldCheck size={16} className="text-amber-500" />
              </div>
           </div>

           <h1 className="text-[24px] font-bold text-black tracking-tight mb-3">Approval Pending</h1>
           <p className="text-[14px] text-black/50 font-medium leading-relaxed mb-8">
              Hello <span className="text-black font-bold">{user?.name}</span>, your account is currently being reviewed by the Nestory administration team. 
              We'll verify your details and notify you via email once your access is granted.
           </p>

           <div className="w-full space-y-4 mb-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                 <Mail size={18} className="text-black/30 shrink-0" />
                 <div>
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Registered Email</p>
                    <p className="text-[13px] font-bold text-black">{user?.email}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                 <ExternalLink size={18} className="text-black/30 shrink-0" />
                 <div>
                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Assigned Role</p>
                    <p className="text-[13px] font-bold text-black">{user?.role === 'AGENCY' ? 'Agency Partner' : 'Developer'}</p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 w-full">
              <Link to="/" className="w-full">
                <button className="w-full h-12 bg-white border border-gray-200 rounded-xl text-[13px] font-bold text-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  Back to Home
                </button>
              </Link>
              <button 
                onClick={signOut}
                className="w-full h-12 bg-black text-white rounded-xl text-[13px] font-bold hover:bg-black/90 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
           </div>
        </div>
        
        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center">
           <p className="text-[11px] text-black/40 font-bold uppercase tracking-widest">Nestory verification system</p>
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingApproval;
