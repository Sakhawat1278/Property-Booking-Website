import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, CreditCard, DollarSign, ArrowUpRight, ArrowDownRight, 
  Calendar, Building2, User, Loader2, Download
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
      
      setTransactions(formatted);
    } catch (err: any) {
      toast.error('Error fetching transactions: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-black">Financial Transactions</h1>
          <p className="text-[12px] text-black/60 mt-0.5">A record of all property sales and rental agreements finalized on the platform.</p>
        </div>
        <button className="h-9 px-4 bg-indigo-600 text-white rounded-lg text-[13px] font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue', value: '$142,500', sub: '+12% from last month', color: 'text-green-600' },
          { label: 'Pending Payouts', value: '$12,840', sub: '3 transactions', color: 'text-orange-600' },
          { label: 'Completed Deals', value: '48', sub: 'Since Jan 2025', color: 'text-indigo-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-200">
            <p className="text-[12px] font-bold text-black/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-[24px] font-bold text-black">{stat.value}</h3>
            <p className={`text-[11px] font-bold mt-2 ${stat.color}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Property & Buyer</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-black uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-black shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-black">{tx.property_title}</p>
                        <p className="text-[11px] text-black/50 font-medium">{tx.buyer_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold ${tx.type === 'SALE' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[14px] font-bold text-black">${tx.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-[12px] text-black font-medium">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-green-600">
                      <ArrowUpRight size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="py-20 text-center text-gray-400">
              <CreditCard size={32} className="mx-auto mb-3 opacity-10" />
              <p className="text-[13px] font-medium">No financial transactions recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
