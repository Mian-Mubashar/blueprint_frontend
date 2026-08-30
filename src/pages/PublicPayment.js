import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  CheckCircle,
  Lock,
  Zap,
  TrendingUp,
  ArrowRight,
  Info
} from 'lucide-react';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const elementStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: 'Inter, system-ui, sans-serif',
      '::placeholder': { color: '#9CA3AF' },
    },
    invalid: { color: '#EF4444' },
  }
};

const PublicPaymentInner = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');

  const quickAmounts = [
    { label: '₦1,000', value: 1000 },
    { label: '₦5,000', value: 5000 },
    { label: '₦10,000', value: 10000 },
    { label: '₦25,000', value: 25000 },
    { label: '₦50,000', value: 50000 },
    { label: '₦100,000', value: 100000 }
  ];

  const handleQuickAmountSelect = (value) => {
    setAmount(value.toString());
    setSelectedQuickAmount(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedQuickAmount(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount) || 0;
    
    if (!amount || isNaN(numericAmount) || numericAmount < 100) {
      toast.error('Minimum payment amount is ₦100');
      return;
    }

    if (numericAmount > 10000000) {
      toast.error('Maximum payment amount is ₦10,000,000');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please refresh the page.');
      return;
    }

    if (!user) {
      if (!payerName.trim() || !payerEmail.trim()) {
        toast.error('Please enter your name and email');
        return;
      }
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      toast.error('Please enter your card details');
      return;
    }

    setLoading(true);

    try {
      console.log('Creating payment intent for amount:', numericAmount);
      
      // Create payment intent and save a DB record
      const { data } = await axios.post('/api/payments/public/create-payment-intent', {
        amount: numericAmount,
        paymentType: 'other',
        payerName: payerName.trim(),
        payerEmail: payerEmail.trim()
      });

      console.log('Payment intent response:', data);

      if (!data || !data.clientSecret) {
        throw new Error(data?.message || 'Failed to create payment intent');
      }

      console.log('Confirming payment with Stripe...');

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      console.log('Stripe payment result:', result);

      if (result.error) {
        console.error('Stripe payment error:', result.error);
        toast.error(result.error.message || 'Payment failed');
        return;
      }

      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        if (data.paymentId) {
          await axios.post('/api/payments/public/confirm-payment', {
            paymentId: data.paymentId,
            paymentIntentId: result.paymentIntent.id
          });
        }

        toast.success(`Payment of ₦${numericAmount.toLocaleString()} successful!`);
        
        // Reset form
        setAmount('');
        setSelectedQuickAmount(null);
        setPayerName('');
        setPayerEmail('');
        
        setTimeout(() => {
          navigate(user ? '/payments' : '/');
        }, 1500);
      } else {
        toast.error('Payment was not completed. Please try again.');
      }

    } catch (err) {
      console.error('Payment error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           'Payment failed. Please try again.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Secure Payment
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Make secure payments quickly and easily. Enter any amount and pay with your card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Features & Info */}
          <div className="lg:col-span-1 space-y-6" data-aos="fade-right">
            {/* Security Features */}
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  SSL Encrypted
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  PCI Compliant
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  Stripe Protected
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  No Card Storage
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Why Choose Us</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span>Instant processing and confirmation</span>
                </li>
                <li className="flex items-start">
                  <Lock className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span>Bank-level security standards</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span>24/7 payment support</span>
                </li>
              </ul>
            </div>

            {/* Info Card */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Payment Information</p>
                  <p>All payments are processed securely through Stripe. Your card details are never stored on our servers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-2" data-aos="fade-left">
            <div className="card shadow-2xl border-2 border-primary-100">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Amount (₦) *
                    </label>
                    
                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                      {quickAmounts.map((quick) => (
                        <button
                          key={quick.value}
                          type="button"
                          onClick={() => handleQuickAmountSelect(quick.value)}
                          className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                            selectedQuickAmount === quick.value
                              ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {quick.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Amount Input */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <DollarSign className="h-6 w-6 text-primary-600" />
                      </div>
                      <input
                        type="number"
                        min="100"
                        step="1"
                        value={amount}
                        onChange={handleAmountChange}
                        className="input-field pl-12 text-lg font-semibold"
                        placeholder="Enter custom amount"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">Minimum: ₦100</p>
                      {amount && parseFloat(amount) >= 100 && (
                        <p className="text-sm font-semibold text-primary-600">
                          Total: ₦{parseFloat(amount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {!user && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full name *
                        </label>
                        <input
                          type="text"
                          value={payerName}
                          onChange={(e) => setPayerName(e.target.value)}
                          className="input-field"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={payerEmail}
                          onChange={(e) => setPayerEmail(e.target.value)}
                          className="input-field"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Card Details */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Lock className="w-5 h-5 text-primary-600 mr-2" />
                      Card Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary-500 focus-within:border-primary-500 transition-colors bg-white">
                          <CardNumberElement options={elementStyle} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary-500 focus-within:border-primary-500 transition-colors bg-white">
                            <CardExpiryElement options={elementStyle} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-primary-500 focus-within:border-primary-500 transition-colors bg-white">
                            <CardCvcElement options={elementStyle} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !amount || parseFloat(amount) < 100}
                    className="btn-primary w-full flex items-center justify-center text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6 mr-2" />
                        Pay ₦{amount ? parseFloat(amount).toLocaleString() : '0'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 pt-4 border-t">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secured by Stripe • Your payment is protected</span>
                  </div>
                </form>
              </div>
            </div>

            {/* Payment Methods Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center bg-white">
                <CreditCard className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Visa & Mastercard</p>
                <p className="text-xs text-gray-500">Accepted</p>
              </div>
              <div className="card text-center bg-white">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure</p>
                <p className="text-xs text-gray-500">256-bit SSL</p>
              </div>
              <div className="card text-center bg-white">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Instant</p>
                <p className="text-xs text-gray-500">Processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicPayment = () => (
  <Elements stripe={stripePromise}>
    <PublicPaymentInner />
  </Elements>
);

export default PublicPayment;

