import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Star,
  Award,
  Globe,
  FileText,
  CreditCard,
  Send,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Building2,
  Handshake,
  LayoutDashboard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { calculateLoanPayment } from '../utils/loanCalculator';

const Home = () => {
  const { user } = useAuth();
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  const services = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Small Business Loans",
      description: "Get funding for your small business with competitive rates and flexible terms. Perfect for startups and growing businesses in Nigeria.",
      features: ["Up to ₦5,000,000", "Flexible repayment", "Quick approval", "No hidden fees"]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Pay Day Loans",
      description: "Need quick cash for emergencies? Our payday loans provide immediate financial relief with same-day approval.",
      features: ["Same-day approval", "Up to ₦500,000", "No collateral required", "Instant disbursement"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Collateral Loans",
      description: "Secure larger loans using your assets as collateral. Get the best rates for property, vehicles, and other valuable assets.",
      features: ["Higher loan amounts", "Lower interest rates", "Asset evaluation", "Flexible terms"]
    }
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Nigeria Focused",
      description: "Designed specifically for Nigerian businesses and individuals"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Licensed & Regulated",
      description: "Fully licensed financial institution with regulatory compliance"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Team",
      description: "Experienced financial advisors dedicated to your success"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Proven Track Record",
      description: "Thousands of satisfied customers across Nigeria"
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Ogunlesi",
      location: "Lagos, Nigeria",
      rating: 5,
      text: "Blue Print Financial helped me secure a business loan when I needed it most. The process was smooth and the rates were competitive."
    },
    {
      name: "Fatima Ibrahim",
      location: "Kano, Nigeria", 
      rating: 5,
      text: "Their payday loan service saved me during an emergency. Quick approval and disbursement made all the difference."
    },
    {
      name: "Chinedu Okoro",
      location: "Abuja, Nigeria",
      rating: 5,
      text: "Professional service and excellent customer support. I highly recommend Blue Print Financial for all your loan needs."
    }
  ];

  const [quickAmount, setQuickAmount] = useState('');
  const [quickDuration, setQuickDuration] = useState('');
  const [quickResult, setQuickResult] = useState(null);
  const [quickLoading, setQuickLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handleQuickCalculate = async () => {
    if (!quickAmount || !quickDuration) {
      toast.error('Please enter loan amount and duration');
      return;
    }
    const amount = parseFloat(quickAmount);
    if (isNaN(amount) || amount < 5000) {
      toast.error('Minimum amount for small business loan is ₦5,000');
      return;
    }
    try {
      setQuickLoading(true);
      const duration = parseInt(quickDuration, 10);
      try {
        const response = await axios.post('/api/loans/calculator/calculate', {
          amount,
          duration,
          loanType: 'small_business'
        });
        setQuickResult(response.data);
      } catch {
        setQuickResult(calculateLoanPayment(amount, duration, 'small_business'));
      }
    } catch (e) {
      toast.error('Failed to calculate loan');
      setQuickResult(null);
    } finally {
      setQuickLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const howItWorks = [
    {
      step: 1,
      icon: <FileText className="w-8 h-8" />,
      title: "Apply Online",
      description: "Fill out our simple online application form with your basic information and loan requirements."
    },
    {
      step: 2,
      icon: <CreditCard className="w-8 h-8" />,
      title: "Get Reviewed",
      description: "Our expert team reviews your application and verifies your documents within 24-48 hours."
    },
    {
      step: 3,
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Get Approved",
      description: "Receive instant notification of your loan approval with competitive rates and flexible terms."
    },
    {
      step: 4,
      icon: <Send className="w-8 h-8" />,
      title: "Receive Funds",
      description: "Get your funds disbursed directly to your bank account via secure bank transfer."
    }
  ];

  const statistics = [
    {
      number: "10,000+",
      label: "Happy Customers",
      icon: <Users className="w-8 h-8" />
    },
    {
      number: "₦500M+",
      label: "Loans Disbursed",
      icon: <DollarSign className="w-8 h-8" />
    },
    {
      number: "95%",
      label: "Approval Rate",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      number: "24hrs",
      label: "Average Processing",
      icon: <Clock className="w-8 h-8" />
    }
  ];

  const faqs = [
    {
      question: "What documents do I need to apply for a loan?",
      answer: "You'll need a valid government-issued ID (National ID, Driver's License, or International Passport), proof of income (salary slip or bank statement), proof of address, and your BVN. For business loans, additional documents like business registration and financial statements may be required."
    },
    {
      question: "How long does it take to get approved?",
      answer: "Most applications are reviewed within 24-48 hours. Payday loans can be approved the same day, while business loans may take 2-3 business days depending on the loan amount and required documentation."
    },
    {
      question: "What is the minimum and maximum loan amount?",
      answer: "For payday loans, you can borrow from ₦50,000 to ₦500,000. Small business loans range from ₦100,000 to ₦5,000,000. Collateral loans can go up to ₦50,000,000 depending on the value of your collateral."
    },
    {
      question: "What are the interest rates?",
      answer: "Interest rates vary based on loan type, amount, and duration. Payday loans typically have rates starting from 5% monthly, while business loans start from 2.5% monthly. Our rates are competitive and transparent with no hidden fees."
    },
    {
      question: "Can I repay my loan early?",
      answer: "Yes, you can repay your loan early without any prepayment penalties. Early repayment can actually save you money on interest. Contact our customer service team to arrange early repayment."
    },
    {
      question: "What happens if I miss a payment?",
      answer: "We understand that financial situations can change. If you're unable to make a payment, please contact us immediately. We offer flexible repayment options and can work with you to create a payment plan that suits your situation. Late fees may apply, but we're committed to finding solutions."
    },
    {
      question: "Do I need collateral for all loans?",
      answer: "No, collateral is only required for collateral loans. Payday loans and small business loans (up to certain amounts) are unsecured and don't require collateral. However, providing collateral can help you secure larger loan amounts at better interest rates."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. We use bank-level encryption and security measures to protect your personal and financial information. We comply with all Nigerian data protection regulations and never share your information with third parties without your consent."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-start lg:items-center relative overflow-hidden pt-24 pb-24 sm:pt-24 sm:pb-28">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Your Financial
                <span className="text-accent-400 block">Blueprint for Success</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Empowering Nigerian businesses and individuals with flexible loan solutions. 
                From small business funding to emergency payday loans, we're your trusted financial partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user && (
                  <Link to={dashboardPath} className="btn-primary bg-white text-gray-900 hover:bg-gray-100 text-center inline-flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 mr-2" />
                    Dashboard
                  </Link>
                )}
                <Link to="/services" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-center">
                  Our Services
                </Link>
              </div>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Loan Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount (₦)
                        <span className="text-xs text-gray-500 ml-1">(Min: ₦5,000)</span>
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="5,000"
                        value={quickAmount}
                        onChange={(e) => setQuickAmount(e.target.value)}
                        min="5000"
                        step="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Duration (months)</label>
                      <select
                        className="input-field"
                        value={quickDuration}
                        onChange={(e) => setQuickDuration(e.target.value)}
                      >
                        <option value="">Select duration</option>
                        <option value="3">3 months</option>
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                      </select>
                    </div>
                    <button
                      className="btn-primary w-full"
                      onClick={handleQuickCalculate}
                      disabled={quickLoading}
                    >
                      {quickLoading ? 'Calculating...' : 'Calculate Payment'}
                    </button>

                    {quickResult && (
                      <div className="mt-4 text-left border-t pt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Monthly Payment:</span>
                          <span className="font-semibold text-primary-600">₦{quickResult.monthlyPayment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Total Interest:</span>
                          <span className="font-semibold">₦{quickResult.totalInterest.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Payment:</span>
                          <span className="font-semibold text-secondary-600">₦{quickResult.totalPayment.toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Blue Print Financial?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional financial services tailored for the Nigerian market
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Financial Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive loan solutions designed to meet your unique financial needs
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
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-secondary-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/services" className="btn-primary w-full text-center">
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by thousands of customers across Nigeria with proven results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="card text-center hover:shadow-2xl transition-all duration-300" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your loan in 4 simple steps - fast, easy, and transparent
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="card text-center h-full">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="mt-8 mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                      <div className="text-primary-600">
                        {step.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300 transform -translate-y-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-primary-300 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of satisfied customers across Nigeria
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card" data-aos="fade-up" data-aos-delay={index * 200}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our loan services
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card" data-aos="fade-up" data-aos-delay={index * 50}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index ? 'max-h-96 mt-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have achieved their financial goals with Blue Print Financial
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to={dashboardPath} className="btn-primary bg-white text-gray-900 hover:bg-gray-100 inline-flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                  Apply for Loan
                </Link>
              )}
              <Link to="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div data-aos="fade-up">
              <Phone className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-gray-300">
                <a href="tel:+17036238800" className="hover:text-white">+1 (703) 623-8800</a>
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <Mail className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300">
                <a href="mailto:info@blueprintmicrofinance.com" className="hover:text-white">info@blueprintmicrofinance.com</a>
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <MapPin className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-gray-300">Lagos, Nigeria</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;



