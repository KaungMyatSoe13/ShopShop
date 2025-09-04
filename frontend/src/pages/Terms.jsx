import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Terms of Service
          </h1>

          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-gray-600">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing and using this website, you accept and agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                2. Use of Our Service
              </h2>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Permitted Use
              </h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Browse and purchase products for personal use</li>
                <li>Create one account per person</li>
                <li>Provide accurate information</li>
                <li>Comply with all applicable laws</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Prohibited Use
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the service for illegal activities</li>
                <li>Create multiple accounts or fake accounts</li>
                <li>Interfere with website functionality</li>
                <li>Attempt unauthorized access to our systems</li>
                <li>Resell products without permission</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                3. Account Registration
              </h2>
              <p className="mb-3">
                To make purchases, you must create an account. You are
                responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Maintaining the confidentiality of your login credentials
                </li>
                <li>All activities under your account</li>
                <li>Notifying us immediately of unauthorized use</li>
                <li>Providing accurate and current information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                4. Orders and Payment
              </h2>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Order Acceptance
              </h3>
              <p className="mb-3">
                All orders are subject to acceptance by us. We reserve the right
                to refuse or cancel orders for any reason, including product
                availability, errors in pricing, or suspected fraud.
              </p>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Pricing
              </h3>
              <p className="mb-3">
                Prices are listed in Myanmar Kyat (MMK) and are subject to
                change without notice. The price at the time of order
                confirmation applies.
              </p>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Payment
              </h3>
              <p>
                We currently accept cash on delivery (COD). Payment is due upon
                receipt of products. Additional payment methods may be added in
                the future.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                5. Shipping and Delivery
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>We ship within Myanmar only</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>You must inspect items immediately upon delivery</li>
                <li>Report any damage or discrepancies within 24 hours</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                6. Returns and Exchanges
              </h2>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Return Policy
              </h3>
              <ul className="list-disc pl-6 space-y-1 mb-4">
                <li>Returns accepted within 7 days of delivery</li>
                <li>Items must be unused with original tags</li>
                <li>Customer pays return shipping costs</li>
                <li>Refund processed within 5-7 business days</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Non-Returnable Items
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Items worn, washed, or damaged by customer</li>
                <li>Items without original tags or packaging</li>
                <li>Customized or personalized items</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                7. Product Information
              </h2>
              <p>
                We strive to provide accurate product descriptions, images, and
                specifications. However, we do not guarantee that all
                information is completely accurate. Colors may vary due to
                monitor settings and photography.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                8. Intellectual Property
              </h2>
              <p className="mb-3">
                All website content, including text, images, logos, and designs,
                are our property or used with permission. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Copy, modify, or distribute our content</li>
                <li>Use our trademarks or logos</li>
                <li>Create derivative works</li>
                <li>Use content for commercial purposes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                9. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, we are not liable for
                any indirect, incidental, or consequential damages arising from
                your use of our services. Our total liability shall not exceed
                the amount you paid for the specific product.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                10. Warranty Disclaimer
              </h2>
              <p>
                Products are provided "as is" without warranties of any kind. We
                disclaim all warranties, express or implied, including
                merchantability and fitness for a particular purpose, except as
                required by law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                11. Privacy
              </h2>
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                personal information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                12. Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to our
                services at any time, without notice, for any reason, including
                violation of these terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                13. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of Myanmar. Any disputes
                will be resolved in the courts of Yangon, Myanmar.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                14. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                constitutes acceptance of modified terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                15. Contact Information
              </h2>
              <p className="mb-3">
                For questions about these terms, contact us:
              </p>
              <ul className="list-none space-y-1">
                <li>
                  <strong>Email:</strong> support@yourstore.com
                </li>
                <li>
                  <strong>Phone:</strong> +95-xxx-xxx-xxxx
                </li>
                <li>
                  <strong>Address:</strong> Yangon, Myanmar
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Important Notice
            </h3>
            <p className="text-sm text-gray-600">
              By using our website and services, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Service
              and our Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Terms;
