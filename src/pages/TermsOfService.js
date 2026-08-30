import React from 'react';
import { FileText, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Scale className="w-6 h-6 text-primary-600 mr-2" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using the services of Blue Print Financial Ltd ("we," "our," or "us"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These terms apply to all users of our website, loan applicants, borrowers, and any other individuals who access or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. About Our Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Blue Print Financial Ltd is a licensed microfinance institution providing the following services:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Small Business Loans</li>
              <li>Payday Loans</li>
              <li>Collateral Loans</li>
              <li>Financial advisory services</li>
              <li>Loan repayment and management services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are licensed and regulated by the Central Bank of Nigeria (CBN) and operate in accordance with all applicable Nigerian financial regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use our services, you must:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Be a Nigerian citizen or legal resident</li>
              <li>Have a valid bank account in Nigeria</li>
              <li>Provide accurate and complete information</li>
              <li>Meet our credit and eligibility criteria</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Loan Application Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Application Submission</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you submit a loan application, you agree to provide accurate, current, and complete information. We reserve the right to verify all information provided and may request additional documentation.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Credit Assessment</h3>
                <p className="text-gray-700 leading-relaxed">
                  We will conduct a credit assessment based on the information you provide, credit bureau reports, and other factors. Approval is at our sole discretion and is not guaranteed.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Loan Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  Loan terms, including interest rates, repayment schedules, and fees, will be clearly disclosed in your loan agreement. You are responsible for reading and understanding all terms before accepting a loan offer.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Interest Rates and Fees</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Interest rates and fees are determined based on:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Loan type and amount</li>
              <li>Loan duration</li>
              <li>Creditworthiness assessment</li>
              <li>Market conditions</li>
              <li>Regulatory requirements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All rates and fees will be clearly disclosed in your loan agreement. Interest rates are subject to change based on market conditions and regulatory requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Repayment Obligations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a borrower, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Repay the loan amount plus interest and fees according to the agreed schedule</li>
              <li>Make payments on or before the due date</li>
              <li>Notify us immediately of any changes to your contact information</li>
              <li>Inform us of any financial difficulties that may affect your ability to repay</li>
              <li>Pay any late fees or penalties as specified in your loan agreement</li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Failure to repay your loan may result in additional fees, negative credit reporting, and legal action.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring the accuracy of all information provided</li>
              <li>Complying with all applicable laws and regulations</li>
              <li>Not using our services for any illegal or unauthorized purpose</li>
              <li>Not attempting to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, graphics, logos, and software, is the property of Blue Print Financial Ltd and is protected by Nigerian and international copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount of fees you have paid to us</li>
              <li>We are not responsible for any losses resulting from unauthorized access to your account</li>
              <li>We do not guarantee that our services will be uninterrupted or error-free</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Suspend or terminate your account at any time for violation of these terms</li>
              <li>Refuse service to anyone for any reason</li>
              <li>Modify or discontinue our services at any time</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You may close your account at any time by contacting us. Outstanding loan obligations will remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Dispute Resolution</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Any disputes arising from these terms or our services shall be resolved through:
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation through a mutually agreed mediator</li>
              <li>Arbitration in accordance with Nigerian Arbitration and Conciliation Act</li>
              <li>Litigation in Nigerian courts as a last resort</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We may modify these Terms of Service at any time. We will notify you of significant changes by posting the updated terms on our website and updating the "Last updated" date. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of Nigerian courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Blue Print Financial Ltd</strong></p>
              <p className="text-gray-700 mb-2">Email: <a href="mailto:legal@blueprintfinancial.com" className="text-primary-600 hover:underline">legal@blueprintfinancial.com</a></p>
              <p className="text-gray-700 mb-2">Phone: +234 (0) 800 000 0000</p>
              <p className="text-gray-700">Address: Victoria Island, Lagos, Nigeria</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

