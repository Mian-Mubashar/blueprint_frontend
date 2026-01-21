import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
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
  Globe
} from 'lucide-react';
import axios from 'axios';

const Home = () => {
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

  const handleQuickCalculate = async () => {
    if (!quickAmount || !quickDuration) {
      return;
    }
    try {
      setQuickLoading(true);
      const response = await axios.post('/api/loans/calculator/calculate', {
        amount: parseFloat(quickAmount),
        duration: parseInt(quickDuration, 10),
        loanType: 'small_business'
      });
      setQuickResult(response.data);
    } catch (e) {
      setQuickResult(null);
    } finally {
      setQuickLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
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
                <Link to="/register" className="btn-primary text-center">
                  Apply Now
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₦)</label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="100,000"
                        value={quickAmount}
                        onChange={(e) => setQuickAmount(e.target.value)}
                        min="10000"
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
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
              <Link to="/register" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                Apply for Loan
              </Link>
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
              <p className="text-gray-300">+1 (703) 623-8800 </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <Mail className="w-8 h-8 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300"> info@ blueprintmicrofinance.com</p>
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



