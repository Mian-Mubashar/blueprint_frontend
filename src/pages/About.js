import React from 'react';
import { 
  Shield, 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Globe,
  Heart,
  CheckCircle,
  Star,
  Quote
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Your financial security is our top priority. We use advanced encryption and follow strict regulatory compliance."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Customer Focus",
      description: "Every decision we make is centered around providing the best possible experience for our customers."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge financial solutions that meet evolving needs."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Impact",
      description: "We're committed to empowering Nigerian businesses and individuals to achieve their financial goals."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "₦2.5B+", label: "Loans Disbursed" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Customer Support" }
  ];

  const team = [
    {
      name: "Dr. Adebayo Ogunlesi",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "20+ years in banking and financial services across Nigeria."
    },
    {
      name: "Fatima Ibrahim",
      position: "Chief Operating Officer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "Expert in digital transformation and customer experience."
    },
    {
      name: "Chinedu Okoro",
      position: "Head of Risk Management",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "Specialized in credit risk assessment and regulatory compliance."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About Blue Print Financial
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Empowering Nigerians with innovative financial solutions since 2020. 
              We're your trusted partner in building a brighter financial future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                To democratize access to financial services in Nigeria by providing 
                fast, affordable, and transparent loan solutions that empower individuals 
                and businesses to achieve their dreams.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe that everyone deserves access to quality financial services, 
                regardless of their background or location. Our mission is to bridge 
                the financial inclusion gap in Nigeria.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-gray-700">Serving all 36 states</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-primary-600 mr-2" />
                  <span className="text-gray-700">Licensed & Regulated</span>
                </div>
              </div>
            </div>
            <div data-aos="fade-left">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These values guide everything we do and shape our commitment to you
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop"
                alt="Nigerian business owners"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Blue Print Financial was founded in 2020 by a team of experienced 
                financial professionals who recognized the need for accessible, 
                transparent lending services in Nigeria.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Starting as a small team in Lagos, we've grown to serve customers 
                across all 36 states of Nigeria. Our journey has been marked by 
                innovation, customer satisfaction, and a deep commitment to financial inclusion.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-secondary-500 mr-3" />
                  <span className="text-gray-700">Licensed by Central Bank of Nigeria</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-secondary-500 mr-3" />
                  <span className="text-gray-700">Member of Nigeria Fintech Association</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-secondary-500 mr-3" />
                  <span className="text-gray-700">ISO 27001 Certified for Data Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to your financial success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center" data-aos="fade-up" data-aos-delay={index * 200}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600">{member.description}</p>
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
              Real stories from real customers across Nigeria
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Blue Print Financial helped me expand my business when I needed it most. The process was smooth and the rates were very competitive.",
                author: "Aisha Mohammed",
                location: "Kano, Nigeria",
                rating: 5
              },
              {
                quote: "I was skeptical about online loans, but Blue Print Financial proved to be trustworthy and professional. Highly recommended!",
                author: "Emeka Nwosu",
                location: "Enugu, Nigeria",
                rating: 5
              },
              {
                quote: "Their customer service is exceptional. They guided me through the entire process and made everything clear and simple.",
                author: "Grace Adebayo",
                location: "Lagos, Nigeria",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="card" data-aos="fade-up" data-aos-delay={index * 200}>
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary-600 mb-4" />
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
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
              <a href="/register" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                Get Started Today
              </a>
              <a href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;



