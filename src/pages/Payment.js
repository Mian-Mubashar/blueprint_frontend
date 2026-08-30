import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Calculator,
  Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from '../components/UserLayout';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { loanId, amount } = location.state || {};
  
  // Ensure amount is properly parsed
  const initialAmount = amount ? parseFloat(amount) : 0;
  
  const [paymentData, setPaymentData] = useState({
    paymentType: 'loan_repayment',
    customAmount: initialAmount > 0 ? initialAmount.toString() : '',
    selectedAmount: initialAmount,
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);

  const baseAmount = initialAmount > 0 ? initialAmount : 1000; // Default to 1000 if no amount provided
  const predefinedAmounts = [
    { label: 'Minimum Payment', amount: Math.round(baseAmount * 0.5) },
    { label: 'Half Payment', amount: Math.round(baseAmount * 0.5) },
    { label: 'Full Payment', amount: Math.round(baseAmount) },
    { label: 'Extra Payment', amount: Math.round(baseAmount * 1.5) },
    { label: 'Double Payment', amount: Math.round(baseAmount * 2) }
  ];

  useEffect(() => {
    if (!location.state || !loanId) {
      toast.error('Invalid payment request. Please select a loan to pay.');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }
    
    // Update amount if it changes
    if (amount) {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        setPaymentData(prev => ({
          ...prev,
          selectedAmount: parsedAmount,
          customAmount: parsedAmount.toString()
        }));
      }
    }
  }, [location.state, loanId, amount, navigate]);

  const handleAmountChange = (newAmount) => {
    setPaymentData({
      ...paymentData,
      selectedAmount: newAmount,
      customAmount: newAmount.toString()
    });
  };

  const handleCustomAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPaymentData({
      ...paymentData,
      customAmount: e.target.value,
      selectedAmount: value
    });
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentData({
      ...paymentData,
      paymentType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.selectedAmount || paymentData.selectedAmount < 10) {
      toast.error('Minimum payment amount is ₦10');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Payment system not ready');
      return;
    }

    setLoading(true);

    try {
      // Ensure amount is a valid number
      const paymentAmount = parseFloat(paymentData.selectedAmount);
      if (isNaN(paymentAmount) || paymentAmount < 10) {
        toast.error('Please enter a valid payment amount (minimum ₦10)');
        return;
      }

      // Ensure loanId is valid
      const parsedLoanId = parseInt(loanId);
      if (isNaN(parsedLoanId) || parsedLoanId <= 0) {
        toast.error('Invalid loan ID. Please try again.');
        return;
      }

      console.log('Creating payment intent:', {
        loanApplicationId: parsedLoanId,
        amount: paymentAmount,
        paymentType: paymentData.paymentType,
        loanIdType: typeof loanId,
        loanIdValue: loanId
      });

      // Create payment intent
      const response = await axios.post('/api/payments/create-payment-intent', {
        loanApplicationId: parsedLoanId,
        amount: paymentAmount,
        paymentType: paymentData.paymentType
      });

      if (!response.data || !response.data.clientSecret) {
        toast.error('Failed to initialize payment. Please try again.');
        return;
      }

      const { clientSecret } = response.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed. Please check your card details.');
      } else {
        // Confirm payment on server
        if (response.data.paymentId) {
          await axios.post('/api/payments/confirm-payment', {
            paymentId: response.data.paymentId,
            paymentIntentId: result.paymentIntent.id
          });
        }

        toast.success('Payment successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map(e => e.msg || e.message).join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = paymentData.selectedAmount;

  return (
    <UserLayout>
      <div className="w-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8" data-aos="fade-up">
            <h1 className="text-3xl font-bold text-gray-900">Make Payment</h1>
            <p className="text-gray-600 mt-2">
              Choose your payment amount and complete the transaction
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Options */}
          <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-right">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Options</h2>
            
            {/* Payment Type - fixed to loan repayment per business rules */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <p className="text-sm font-semibold text-primary-700">
                Loan Repayment
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Payments are only for loan repayment. No application or processing fees are charged.
              </p>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Amount
              </label>
              
              {/* Predefined Amounts */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                {predefinedAmounts.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAmountChange(item.amount)}
                    className={`p-3 border-2 rounded-lg text-left transition-all ${
                      paymentData.selectedAmount === item.amount
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-primary-600 font-semibold">
                      ₦{item.amount.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={paymentData.customAmount}
                    onChange={handleCustomAmountChange}
                    className="input-field pl-10"
                    placeholder="Enter custom amount"
                    min="100"
                    max="1000000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: ₦100 | Maximum: ₦1,000,000
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="font-bold text-primary-600">₦{paymentData.selectedAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  No processing fees. You pay exactly what you select.
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Payment Flexibility</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    You can pay any amount you want. There's no minimum requirement for loan payments.
                    Pay as much or as little as you prefer!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-left">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Element */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Information
                </label>
                <div className="border border-gray-300 rounded-lg p-4">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#374151',
                          '::placeholder': {
                            color: '#9CA3AF',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { value: 'bank_transfer', label: 'Bank Transfer', icon: Calculator }
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentData({
                        ...paymentData,
                        paymentMethod: method.value
                      })}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        paymentData.paymentMethod === method.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className="w-5 h-5 mx-auto mb-2" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !paymentData.selectedAmount}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay ₦{totalAmount.toLocaleString()}
                  </>
                )}
              </button>
            </form>

            {/* Security Info */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h4 className="font-semibold text-green-900">Secure Payment</h4>
                  <p className="text-green-800 text-sm">
                    Your payment is secured with 256-bit SSL encryption and processed by Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </UserLayout>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;


