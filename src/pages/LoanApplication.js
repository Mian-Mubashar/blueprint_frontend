import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  Shield, 
  Calculator,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Building,
  Car,
  Briefcase
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key');

const LoanApplicationForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loanType: 'small_business',
    amountRequested: '',
    loanDuration: '',
    purpose: '',
    collateralDetails: {},
    businessDetails: {}
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loanRates, setLoanRates] = useState({});
  const [maxAmounts, setMaxAmounts] = useState({});
  const [calculatedPayment, setCalculatedPayment] = useState(null);

  useEffect(() => {
    fetchLoanRates();
  }, []);

  const fetchLoanRates = async () => {
    try {
      const response = await axios.get('/api/loans/calculator/rates');
      setLoanRates(response.data.interestRates);
      setMaxAmounts(response.data.maxAmounts);
    } catch (error) {
      toast.error('Failed to load loan information');
    }
  };

  const calculatePayment = async () => {
    if (!formData.amountRequested || !formData.loanDuration || !formData.loanType) {
      toast.error('Please fill in amount and duration');
      return;
    }

    try {
      const response = await axios.post('/api/loans/calculator/calculate', {
        amount: parseFloat(formData.amountRequested),
        duration: parseInt(formData.loanDuration),
        loanType: formData.loanType
      });
      setCalculatedPayment(response.data);
    } catch (error) {
      toast.error('Failed to calculate payment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCollateralChange = (field, value) => {
    setFormData({
      ...formData,
      collateralDetails: {
        ...formData.collateralDetails,
        [field]: value
      }
    });
  };

  const handleBusinessChange = (field, value) => {
    setFormData({
      ...formData,
      businessDetails: {
        ...formData.businessDetails,
        [field]: value
      }
    });
  };

  const validateStep1 = () => {
    if (!formData.amountRequested || !formData.loanDuration || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return false;
    }

    const maxAmount = maxAmounts[formData.loanType];
    if (parseFloat(formData.amountRequested) > maxAmount) {
      toast.error(`Maximum amount for ${formData.loanType.replace('_', ' ')} loan is ₦${maxAmount.toLocaleString()}`);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      calculatePayment();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/loans/apply', formData);
      toast.success('Loan application submitted successfully!');
      
      // Redirect to payment page with loan details
      navigate('/payment', { 
        state: { 
          loanId: response.data.application.id,
          amount: calculatedPayment?.monthlyPayment || 0,
          loanType: formData.loanType,
          loanAmount: formData.amountRequested
        }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loan Type *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'small_business', label: 'Small Business', icon: Building, desc: 'For business growth' },
            { value: 'payday', label: 'Payday Loan', icon: DollarSign, desc: 'Quick emergency funds' },
            { value: 'collateral', label: 'Collateral Loan', icon: Shield, desc: 'Secured with assets' }
          ].map((type) => (
            <div
              key={type.value}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.loanType === type.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'loanType', value: type.value } })}
            >
              <div className="flex items-center mb-2">
                <type.icon className="w-6 h-6 text-primary-600 mr-2" />
                <span className="font-medium text-gray-900">{type.label}</span>
              </div>
              <p className="text-sm text-gray-600">{type.desc}</p>
              <p className="text-xs text-gray-500 mt-1">
                Interest: {loanRates[type.value] || 'N/A'}% | Max: ₦{maxAmounts[type.value]?.toLocaleString() || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amountRequested" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (₦) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="amountRequested"
              name="amountRequested"
              type="number"
              required
              value={formData.amountRequested}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Enter loan amount"
              min="10000"
              max={maxAmounts[formData.loanType] || 50000000}
            />
          </div>
        </div>

        <div>
          <label htmlFor="loanDuration" className="block text-sm font-medium text-gray-700 mb-2">
            Loan Duration (months) *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              id="loanDuration"
              name="loanDuration"
              required
              value={formData.loanDuration}
              onChange={handleChange}
              className="input-field pl-10"
            >
              <option value="">Select duration</option>
              {formData.loanType === 'payday' ? (
                <>
                  <option value="1">1 month</option>
                  <option value="2">2 months</option>
                  <option value="3">3 months</option>
                </>
              ) : (
                <>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
          Loan Purpose *
        </label>
        <textarea
          id="purpose"
          name="purpose"
          required
          rows={3}
          value={formData.purpose}
          onChange={handleChange}
          className="input-field"
          placeholder="Describe the purpose of your loan..."
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Calculation</h3>
      
      {calculatedPayment && (
        <div className="bg-primary-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Calculator className="w-6 h-6 text-primary-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">Loan Summary</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-semibold">₦{calculatedPayment.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-semibold">{calculatedPayment.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Duration:</span>
                <span className="font-semibold">{calculatedPayment.loanDuration} months</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-primary-600">₦{calculatedPayment.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold">₦{calculatedPayment.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-semibold text-secondary-600">₦{calculatedPayment.totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {formData.loanType === 'collateral' && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Collateral Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collateral Type
              </label>
              <select
                value={formData.collateralDetails.type || ''}
                onChange={(e) => handleCollateralChange('type', e.target.value)}
                className="input-field"
              >
                <option value="">Select collateral type</option>
                <option value="property">Real Estate Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="equipment">Business Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Value (₦)
              </label>
              <input
                type="number"
                value={formData.collateralDetails.value || ''}
                onChange={(e) => handleCollateralChange('value', e.target.value)}
                className="input-field"
                placeholder="Enter estimated value"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collateral Description
              </label>
              <textarea
                rows={3}
                value={formData.collateralDetails.description || ''}
                onChange={(e) => handleCollateralChange('description', e.target.value)}
                className="input-field"
                placeholder="Describe your collateral..."
              />
            </div>
          </div>
        </div>
      )}

      {formData.loanType === 'small_business' && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={formData.businessDetails.name || ''}
                onChange={(e) => handleBusinessChange('name', e.target.value)}
                className="input-field"
                placeholder="Enter business name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select
                value={formData.businessDetails.type || ''}
                onChange={(e) => handleBusinessChange('type', e.target.value)}
                className="input-field"
              >
                <option value="">Select business type</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="services">Services</option>
                <option value="agriculture">Agriculture</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Revenue (₦)
              </label>
              <input
                type="number"
                value={formData.businessDetails.revenue || ''}
                onChange={(e) => handleBusinessChange('revenue', e.target.value)}
                className="input-field"
                placeholder="Enter monthly revenue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in Business
              </label>
              <input
                type="number"
                value={formData.businessDetails.years || ''}
                onChange={(e) => handleBusinessChange('years', e.target.value)}
                className="input-field"
                placeholder="Enter years in business"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Description
              </label>
              <textarea
                rows={3}
                value={formData.businessDetails.description || ''}
                onChange={(e) => handleBusinessChange('description', e.target.value)}
                className="input-field"
                placeholder="Describe your business..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Review</h3>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Please review your application</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Loan Type:</span>
            <span className="font-semibold capitalize">{formData.loanType.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">₦{formData.amountRequested}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{formData.loanDuration} months</span>
          </div>
          {calculatedPayment && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-primary-600">₦{calculatedPayment.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-semibold">{calculatedPayment.interestRate}%</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Important Notice</h4>
            <p className="text-blue-800 text-sm mt-1">
              By submitting this application, you agree to our terms and conditions. 
              We will review your application and contact you within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          required
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
          I agree to the{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-3xl font-bold text-gray-900">Apply for a Loan</h1>
          <p className="text-gray-600 mt-2">
            Get the funding you need with our flexible loan options
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Loan Details</span>
              <span>Additional Info</span>
              <span>Review & Submit</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-6 py-2 border border-gray-300 rounded-lg text-gray-700 ${
                  currentStep === 1 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LoanApplication = () => {
  return (
    <Elements stripe={stripePromise}>
      <LoanApplicationForm />
    </Elements>
  );
};

export default LoanApplication;

