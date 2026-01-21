import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Clock, 
  Shield, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Building,
  Car,
  Briefcase,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Services = () => {
  const [loanRates, setLoanRates] = useState({});
  const [maxAmounts, setMaxAmounts] = useState({});
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: <Building className="w-8 h-8" />,
      title: "Small Business Loans",
      description: "Fuel your business growth with our flexible small business loan solutions designed for Nigerian entrepreneurs.",
      features: [
        "Up to ₦5,000,000 loan amount",
        "Competitive interest rates starting from 15.5%",
        "Flexible repayment terms up to 60 months",
        "Quick approval within 24-48 hours",
        "No hidden fees or charges",
        "Dedicated business relationship manager"
      ],
      benefits: [
        "Expand your business operations",
        "Purchase inventory and equipment",
        "Working capital for day-to-day operations",
        "Marketing and promotional activities",
        "Technology upgrades and digital transformation"
      ],
      requirements: [
        "Valid Nigerian business registration",
        "Minimum 6 months in business",
        "Monthly revenue of at least ₦100,000",
        "Valid bank account in business name",
        "Business bank statements (3 months)"
      ],
      loanType: "small_business"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Payday Loans",
      description: "Get quick access to cash for emergencies with our fast and reliable payday loan service.",
      features: [
        "Up to ₦500,000 loan amount",
        "Same-day approval and disbursement",
        "No collateral required",
        "Flexible repayment up to 3 months",
        "Simple online application process",
        "Instant decision on your application"
      ],
      benefits: [
        "Emergency medical expenses",
        "Urgent home repairs",
        "Unexpected bills and expenses",
        "Travel emergencies",
        "Educational expenses"
      ],
      requirements: [
        "Valid employment with minimum 3 months tenure",
        "Monthly salary of at least ₦50,000",
        "Valid bank account",
        "Salary account statements (3 months)",
        "Valid government-issued ID"
      ],
      loanType: "payday"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Collateral Loans",
      description: "Secure larger loans using your valuable assets as collateral with our competitive rates.",
      features: [
        "Up to ₦50,000,000 loan amount",
        "Lower interest rates starting from 12%",
        "Flexible repayment terms up to 60 months",
        "Professional asset valuation service",
        "Secure asset storage options",
        "Transparent terms and conditions"
      ],
      benefits: [
        "Property investment and development",
        "Large equipment purchases",
        "Business expansion projects",
        "Debt consolidation",
        "Major life investments"
      ],
      requirements: [
        "Valid ownership of collateral asset",
        "Professional asset valuation report",
        "Valid insurance coverage",
        "Clear title documents",
        "Asset must meet our valuation criteria"
      ],
      loanType: "collateral"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Apply Online",
      description: "Fill out our simple online application form with your basic information and loan requirements.",
      icon: <Calculator className="w-6 h-6" />
    },
    {
      step: "02", 
      title: "Document Review",
      description: "Our team reviews your application and documents to ensure everything is in order.",
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Approval",
      description: "Receive quick approval notification and loan terms tailored to your needs.",
      icon: <Award className="w-6 h-6" />
    },
    {
      step: "04",
      title: "Disbursement",
      description: "Get your funds transferred directly to your account within 24-48 hours.",
      icon: <DollarSign className="w-6 h-6" />
    }
  ];

  const whyChooseUs = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Competitive Rates",
      description: "We offer some of the most competitive interest rates in Nigeria"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast Processing",
      description: "Quick approval and disbursement to meet your urgent needs"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Your data and transactions are protected with bank-level security"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Support",
      description: "Dedicated customer support team to guide you through the process"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our Financial Services
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Comprehensive loan solutions designed to meet your unique financial needs. 
              From small business funding to emergency loans, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Loan Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer three main types of loans, each designed to meet specific financial needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 200}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                  <div className="text-primary-600">
                    {service.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-secondary-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Perfect For:</h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <ArrowRight className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {service.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-accent-500 mr-2 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {!loading && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interest Rate:</span>
                      <span className="font-semibold text-primary-600">
                        {loanRates[service.loanType] || 'N/A'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-600">Max Amount:</span>
                      <span className="font-semibold text-secondary-600">
                        ₦{maxAmounts[service.loanType]?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}

                <Link 
                  to="/apply-loan" 
                  className="btn-primary w-full text-center"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting a loan with Blue Print Financial is quick and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>
                <div className="text-sm font-semibold text-primary-600 mb-2">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Blue Print Financial?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best financial services in Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((reason, index) => (
              <div key={index} className="card text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {reason.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Loan Payment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use our loan calculator to estimate your monthly payments
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-up">
              <LoanCalculator loanRates={loanRates} maxAmounts={maxAmounts} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Apply for a Loan?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have achieved their financial goals with our loan solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply-loan" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                Apply Now
              </Link>
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Loan Calculator Component
const LoanCalculator = ({ loanRates, maxAmounts }) => {
  const [formData, setFormData] = useState({
    loanType: 'small_business',
    amount: '',
    duration: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateLoan = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.duration) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('/api/loans/calculator/calculate', formData);
      setResult(response.data);
    } catch (error) {
      toast.error('Failed to calculate loan');
    }
  };

  return (
    <div>
      <form onSubmit={calculateLoan} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Type
          </label>
          <select
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="small_business">Small Business Loan</option>
            <option value="payday">Payday Loan</option>
            <option value="collateral">Collateral Loan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount (₦)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter loan amount"
            min="10000"
            max={maxAmounts[formData.loanType] || 50000000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Duration (months)
          </label>
          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="input-field"
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

        <button type="submit" className="btn-primary w-full">
          Calculate Payment
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Calculation Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-primary-600">₦{result.monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Interest Rate:</span>
                <span className="font-semibold">{result.interestRate}%</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold">₦{result.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Payment:</span>
                <span className="font-semibold text-secondary-600">₦{result.totalPayment.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;



