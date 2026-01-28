import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, DollarSign } from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const elementStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444' },
  }
};

const QuickPaymentInner = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) || 0;
    if (numericAmount < 100) {
      toast.error('Minimum amount is ₦100');
      return;
    }
    if (!stripe || !elements) {
      toast.error('Payment system not ready');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/payments/public/create-payment-intent', { amount: numericAmount });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        }
      });
      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
        return;
      }
      toast.success('Payment successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quick Payment</h1>
        <p className="text-gray-600 mb-8">Pay any amount securely with your card.</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                min="100"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter amount"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum: ₦100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number (Card Number)</label>
            <div className="border border-gray-300 rounded-lg p-3">
              <CardNumberElement options={elementStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <div className="border border-gray-300 rounded-lg p-3">
                <CardExpiryElement options={elementStyle} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
              <div className="border border-gray-300 rounded-lg p-3">
                <CardCvcElement options={elementStyle} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? 'Processing...' : (<><CreditCard className="w-5 h-5 mr-2" /> Pay ₦{(parseFloat(amount)||0).toLocaleString()}</>)}
          </button>
        </form>
      </div>
    </div>
  );
};

const QuickPayment = () => (
  <Elements stripe={stripePromise}>
    <QuickPaymentInner />
  </Elements>
);

export default QuickPayment;


