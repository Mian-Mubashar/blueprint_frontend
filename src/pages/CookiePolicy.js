import React from 'react';
import { Cookie, Settings, Shield } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-4">
            <Cookie className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies allow a website to recognize your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Blue Print Financial Ltd uses cookies for the following purposes:
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Performance Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.3 Functionality Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.4 Targeting/Advertising Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant content on other sites.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">session_id</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Maintains your session while using our website</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Session</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">auth_token</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Stores authentication information</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Stores your website preferences</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">1 year</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">analytics</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Helps us analyze website usage</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-6 h-6 text-primary-600 mr-2" />
              4. Managing Cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Manage Cookies in Different Browsers:</h3>
              <ul className="space-y-2 text-blue-800">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Note:</strong> If you choose to disable cookies, some features of our website may not function properly, and you may not be able to access certain services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide other services. These third parties may include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Google Analytics for website analytics</li>
              <li>Payment processors for secure payment processing</li>
              <li>Social media platforms for social sharing features</li>
              <li>Advertising networks for targeted advertising</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These third parties may use cookies to collect information about your online activities across different websites. We do not control these cookies, and you should review the privacy policies of these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-primary-600 mr-2" />
              6. Security and Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We take the security and privacy of your information seriously. Our cookies:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Do not contain personally identifiable information unless you have provided it</li>
              <li>Are encrypted when transmitted</li>
              <li>Are stored securely on our servers</li>
              <li>Are not shared with unauthorized third parties</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              For more information about how we protect your privacy, please see our <a href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Cookie Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Blue Print Financial Ltd</strong></p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:privacy@blueprintfinancial.com" className="text-primary-600 hover:underline">privacy@blueprintfinancial.com</a></p>
              <p className="text-gray-700 mb-2">Phone: +234 (0) 800 000 0000</p>
              <p className="text-gray-700">Address: Victoria Island, Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

