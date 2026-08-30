import React from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key } from 'lucide-react';

const Security = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Security</h1>
          </div>
          <p className="text-gray-600">Your security is our top priority</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 text-primary-600 mr-2" />
              Our Security Measures
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Blue Print Financial Ltd, we implement industry-leading security measures to protect your personal and financial information. Your trust is important to us, and we are committed to maintaining the highest standards of security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Data Encryption</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">SSL/TLS Encryption</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All data transmitted between your device and our servers is encrypted using SSL/TLS (Secure Sockets Layer/Transport Layer Security) technology. This ensures that your information cannot be intercepted or read by unauthorized parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Data at Rest Encryption</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All sensitive data stored in our databases is encrypted using advanced encryption algorithms. This protects your information even if our systems are compromised.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Secure Authentication</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <Key className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Multi-Factor Authentication</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use multi-factor authentication (MFA) to add an extra layer of security to your account. This requires you to provide multiple forms of verification before accessing your account.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Key className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Strong Password Requirements</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We enforce strong password policies requiring a combination of letters, numbers, and special characters. Passwords are hashed using industry-standard algorithms and never stored in plain text.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Payment Security</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">PCI DSS Compliance</h3>
                  <p className="text-blue-800 leading-relaxed mb-4">
                    We are compliant with the Payment Card Industry Data Security Standard (PCI DSS), ensuring that all payment card information is handled securely.
                  </p>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Secure Payment Processing</h3>
                  <p className="text-blue-800 leading-relaxed">
                    All payment transactions are processed through secure, encrypted channels. We use trusted payment processors and never store your full card details on our servers.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. System Security</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Regular security audits and penetration testing</li>
              <li>Firewall protection and intrusion detection systems</li>
              <li>24/7 security monitoring and threat detection</li>
              <li>Regular software updates and security patches</li>
              <li>Secure server infrastructure with redundant backups</li>
              <li>Access controls and role-based permissions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Employee Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our employees undergo rigorous background checks and security training. We implement:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Strict access controls - employees only access information necessary for their role</li>
              <li>Regular security awareness training</li>
              <li>Confidentiality agreements and non-disclosure agreements</li>
              <li>Monitoring and auditing of employee access to sensitive data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
              How You Can Help Protect Your Account
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Security Best Practices:</h3>
              <ul className="space-y-2 text-yellow-800">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Use a strong, unique password for your account</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Never share your login credentials with anyone</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Enable multi-factor authentication when available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Log out of your account when using shared devices</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Be cautious of phishing emails and suspicious links</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep your device software and browsers updated</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monitor your account regularly for suspicious activity</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Reporting Security Issues</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you discover a security vulnerability or suspect unauthorized access to your account, please contact us immediately:
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Security Incident Response</h3>
                  <p className="text-red-800 leading-relaxed mb-3">
                    <strong>Email:</strong> <a href="mailto:security@blueprintfinancial.com" className="underline">security@blueprintfinancial.com</a>
                  </p>
                  <p className="text-red-800 leading-relaxed mb-3">
                    <strong>Phone:</strong> +234 (0) 800 000 0000 (24/7 Security Hotline)
                  </p>
                  <p className="text-red-800 leading-relaxed">
                    We take all security reports seriously and will investigate promptly. Please include as much detail as possible about the issue.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Compliance and Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Regulatory Compliance</h3>
                <p className="text-gray-700 text-sm">
                  Licensed and regulated by the Central Bank of Nigeria (CBN)
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
                <p className="text-gray-700 text-sm">
                  Certified for Information Security Management
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">PCI DSS</h3>
                <p className="text-gray-700 text-sm">
                  Compliant with Payment Card Industry standards
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">GDPR</h3>
                <p className="text-gray-700 text-sm">
                  Compliant with data protection regulations
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Regular Updates</h2>
            <p className="text-gray-700 leading-relaxed">
              We continuously update our security measures to address emerging threats and maintain the highest level of protection. Our security team regularly reviews and enhances our systems to ensure your information remains secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For security-related inquiries, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Blue Print Financial Ltd</strong></p>
              <p className="text-gray-700 mb-2">Security Team</p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:security@blueprintfinancial.com" className="text-primary-600 hover:underline">security@blueprintfinancial.com</a></p>
              <p className="text-gray-700 mb-2">Phone: +234 (0) 800 000 0000</p>
              <p className="text-gray-700">Address: Victoria Island, Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Security;

