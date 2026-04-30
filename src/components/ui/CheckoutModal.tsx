import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  propertyName: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSuccess, amount, propertyName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card details (mocked)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Close after showing success state
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
        onClose();
        // Reset form
        setCardNumber('');
        setExpiry('');
        setCvc('');
        setName('');
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-[32px] p-8 border border-gray-100 shadow-2xl relative overflow-hidden"
            >
              {!success && (
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-[#1A1A1A] hover:bg-gray-100 rounded-full transition-all z-10"
                >
                  <X size={20} />
                </button>
              )}

              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-[24px] font-bold text-[#1A1A1A] mb-2 text-center">Payment Successful</h2>
                    <p className="text-[14px] text-gray-500 text-center">Your booking for {propertyName} is confirmed.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">
                        <Lock size={12} /> Secure Checkout
                      </div>
                      <h2 className="text-[24px] font-bold text-[#1A1A1A] leading-tight">Complete Booking</h2>
                      <p className="text-[13px] text-gray-500 mt-1">{propertyName}</p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[13px] text-gray-500">Total Due</span>
                        <span className="text-[24px] font-bold text-[#1A1A1A]">${amount.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-gray-400">Includes all taxes and fees</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Cardholder Name</label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name on card" 
                          className="w-full h-12 bg-gray-50 border border-gray-200 rounded-full px-6 text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="0000 0000 0000 0000" 
                            maxLength={19}
                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-full pl-12 pr-6 text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                          <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Expiry Date</label>
                          <input 
                            type="text" 
                            required
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY" 
                            maxLength={5}
                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-full px-6 text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">CVC</label>
                          <input 
                            type="text" 
                            required
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="123" 
                            maxLength={4}
                            className="w-full h-12 bg-gray-50 border border-gray-200 rounded-full px-6 text-[13px] focus:outline-none focus:border-brand transition-colors placeholder:text-gray-300"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading}
                          type="submit"
                          className="w-full h-12 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center gap-2 text-[13px] font-medium transition-all shadow-lg shadow-black/10 disabled:opacity-70"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Lock size={14} /> Pay ${amount.toLocaleString()}
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
