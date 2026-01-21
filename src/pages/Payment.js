import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Calculator,
  Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { loanId, amount, loanType, loanAmount } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    paymentType: 'loan_repayment',
    customAmount: '',
    selectedAmount: amount || 0,
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [processingFee, setProcessingFee] = useState(0);

  const predefinedAmounts = [
    { label: 'Minimum Payment', amount: Math.round(amount * 0.5) },
    { label: 'Half Payment', amount: Math.round(amount * 0.5) },
    { label: 'Full Payment', amount: Math.round(amount) },
    { label: 'Extra Payment', amount: Math.round(amount * 1.5) },
    { label: 'Double Payment', amount: Math.round(amount * 2) }
  ];

  useEffect(() => {
    if (!location.state) {
      navigate('/dashboard');
      return;
    }
    calculateProcessingFee(paymentData.selectedAmount);
  }, [paymentData.selectedAmount]);

  const calculateProcessingFee = (amount) => {
    // 2.5% processing fee
    const fee = Math.round(amount * 0.025);
    setProcessingFee(fee);
  };

  const handleAmountChange = (newAmount) => {
    setPaymentData({
      ...paymentData,
      selectedAmount: newAmount,
      customAmount: newAmount.toString()
    });
    calculateProcessingFee(newAmount);
  };

  const handleCustomAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setPaymentData({
      ...paymentData,
      customAmount: e.target.value,
      selectedAmount: value
    });
    calculateProcessingFee(value);
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentData({
      ...paymentData,
      paymentType: type
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.selectedAmount || paymentData.selectedAmount < 100) {
      toast.error('Minimum payment amount is ₦100');
      return;
    }

    if (!stripe || !elements) {
      toast.error('Payment system not ready');
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const response = await axios.post('/api/payments/create-payment-intent', {
        loanApplicationId: loanId,
        amount: paymentData.selectedAmount,
        paymentType: paymentData.paymentType
      });

      const { clientSecret } = response.data;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Confirm payment on server
        await axios.post('/api/payments/confirm-payment', {
          paymentId: response.data.paymentId,
          paymentIntentId: result.paymentIntent.id
        });

        toast.success('Payment successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = paymentData.selectedAmount + processingFee;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Make Payment</h1>
          <p className="text-gray-600 mt-2">
            Choose your payment amount and complete the transaction
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Options */}
          <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-right">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Options</h2>
            
            {/* Payment Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'loan_repayment', label: 'Loan Repayment' },
                  { value: 'processing_fee', label: 'Processing Fee' },
                  { value: 'early_repayment', label: 'Early Payment' },
                  { value: 'late_fee', label: 'Late Fee' }
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handlePaymentTypeChange(type.value)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      paymentData.paymentType === type.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
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
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Amount:</span>
                  <span className="font-semibold">₦{paymentData.selectedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee (2.5%):</span>
                  <span className="font-semibold">₦{processingFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-900 font-semibold">Total Amount:</span>
                  <span className="font-bold text-primary-600">₦{totalAmount.toLocaleString()}</span>
                </div>
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


