import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, ArrowUpRight, Building2, Loader2, Download,
  TrendingUp, Activity, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  property_title: string;
  buyer_name: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  date: string;
  type: 'SALE' | 'RENTAL';
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayouts: 0,
    completedDeals: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // Fetch confirmed bookings as 'Rental' transactions
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (title)
        `)
        .eq('status', 'CONFIRMED')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formatted = data.map((item: any) => ({
        id: item.id,
        property_title: item.properties?.title || 'Unknown Property',
        buyer_name: item.guest_name,
        amount: item.total_amount || 0,
        status: 'COMPLETED',
        date: item.created_at,
        type: item.type === 'BOOKING' ? 'RENTAL' : 'SALE'
      }));
      
      const totalRev = formatted.reduce((acc, curr) => acc + curr.amount, 0);
      
      setTransactions(formatted);
      setStats({
        totalRevenue: totalRev,
        pendingPayouts: formatted.length * 120, // Example logic for payouts
        completedDeals: formatted.length
      });

    } catch (err: any) {
      toast.error('Error fetching transactions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins text-black">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black uppercase tracking-tight">Financial Ledger</h1>
          <p className="text-[12px] text-black font-medium opacity-60 mt-0.5">Audit log of all finalized sales and rental agreements.</p>
        </div>
        <button className="h-9 px-4 bg-black text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-black/90 transition-all shadow-sm">
          <Download size={16} />
          Export Audit Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Gross Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: <TrendingUp size={16} />, color: 'text-black' },
          { label: 'Platform Commission', value: `$${(stats.totalRevenue * 0.1).toLocaleString()}`, icon: <Activity size={16} />, color: 'text-black' },
          { label: 'Settled Transactions', value: stats.completedDeals.toString(), icon: <CheckCircle2 size={16} />, color: 'text-black' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[11px] font-bold text-black opacity-40 uppercase tracking-widest">{stat.label}</p>
               {stat.icon}
            </div>
            <h3 className="text-[28px] font-bold text-black">{stat.value}</h3>
            <p className="text-[10px] font-bold text-green-600 mt-2 uppercase tracking-tighter flex items-center gap-1">
               <ArrowUpRight size={12} /> Live Database Synced
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Transaction Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-black shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black">{tx.property_title}</p>
                        <p className="text-[11px] text-black font-medium opacity-50">{tx.buyer_name} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      tx.type === 'SALE' ? 'bg-indigo-50 text-black border-indigo-100' : 'bg-emerald-50 text-black border-emerald-100'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[15px] font-bold text-black">${tx.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-black">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Settled</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="py-20 text-center text-black/20">
              <CreditCard size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-bold">No financial activity detected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
