import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Globe,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/contact/submit', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      details: ["+234 (0) 123 456 7890", "+234 (0) 987 654 3210"],
      description: "Call us for immediate assistance"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      details: ["info@blueprintfinancial.ng", "support@blueprintfinancial.ng"],
      description: "Send us an email anytime"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      details: ["123 Victoria Island", "Lagos, Nigeria"],
      description: "Visit our office in Lagos"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM"],
      description: "We're here to help you"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I get approved for a loan?",
      answer: "Most loan applications are approved within 24-48 hours. Payday loans can be approved and disbursed on the same day."
    },
    {
      question: "What documents do I need to apply for a loan?",
      answer: "You'll need a valid ID, bank statements (3 months), proof of income, and depending on the loan type, business registration documents or collateral documentation."
    },
    {
      question: "What is the minimum and maximum loan amount?",
      answer: "Minimum loan amount is ₦10,000. Maximum amounts vary by loan type: Small Business (₦5M), Payday (₦500K), Collateral (₦50M)."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No, we believe in transparency. All fees are clearly stated upfront with no hidden charges."
    },
    {
      question: "Can I pay off my loan early?",
      answer: "Yes, you can pay off your loan early without any penalties. This can actually save you money on interest."
    },
    {
      question: "Do you serve customers outside Lagos?",
      answer: "Yes, we serve customers across all 36 states of Nigeria. Our online platform makes it easy to apply from anywhere."
    }
  ];

  const offices = [
    {
      city: "Lagos",
      address: "123 Victoria Island, Lagos",
      phone: "+234 (0) 123 456 7890",
      email: "lagos@blueprintfinancial.ng"
    },
    {
      city: "Abuja",
      address: "456 Central Business District, Abuja",
      phone: "+234 (0) 987 654 3210",
      email: "abuja@blueprintfinancial.ng"
    },
    {
      city: "Kano",
      address: "789 Nasarawa GRA, Kano",
      phone: "+234 (0) 555 123 4567",
      email: "kano@blueprintfinancial.ng"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We're here to help you with all your financial needs. 
              Get in touch with our expert team today.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us - choose what works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="card text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div data-aos="fade-right">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Send us a Message
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select a subject</option>
                        <option value="Loan Application">Loan Application</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Account Issues">Account Issues</option>
                        <option value="Payment Questions">Payment Questions</option>
                        <option value="Business Partnership">Business Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Map & Additional Info */}
            <div data-aos="fade-left">
              <div className="space-y-8">
                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">Victoria Island, Lagos</p>
                  </div>
                </div>

                {/* Office Locations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Our Office Locations
                  </h4>
                  <div className="space-y-4">
                    {offices.map((office, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-4">
                        <h5 className="font-semibold text-gray-900">{office.city}</h5>
                        <p className="text-sm text-gray-600">{office.address}</p>
                        <p className="text-sm text-gray-600">{office.phone}</p>
                        <p className="text-sm text-primary-600">{office.email}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Response */}
                <div className="bg-primary-50 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <MessageCircle className="w-6 h-6 text-primary-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Quick Response</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                  <div className="flex items-center text-sm text-primary-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Average response time: 2-4 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6" data-aos="fade-up" data-aos-delay={index * 100}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12" data-aos="fade-up">
            <p className="text-gray-600 mb-4">
              Don't see your question here?
            </p>
            <a href="#contact-form" className="btn-primary">
              Ask Us Directly
            </a>
          </div>
        </div>
      </section>

      {/* Social Media & Newsletter */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stay Connected
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Follow us on social media and subscribe to our newsletter for updates and financial tips
            </p>
            
            <div className="flex justify-center space-x-6 mb-8">
              <button
                type="button"
                onClick={() => toast.info('Website coming soon')}
                className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors"
              >
                <Globe className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => toast.info('Social channel coming soon')}
                className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => toast.info('Community channel coming soon')}
                className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors"
              >
                <Users className="w-6 h-6" />
              </button>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn-primary rounded-l-none">
                  Subscribe
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;



