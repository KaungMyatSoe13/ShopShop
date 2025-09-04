import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our collection, select your desired items with size and color, add them to cart, and proceed to checkout. You can create an account for faster future orders or checkout as a guest.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash on delivery (COD) for orders within Yangon and major cities in Myanmar. Online payment options are coming soon!",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery times vary by location: Yangon (1-2 business days), Mandalay (2-4 business days), Other cities (2-7 business days). We'll provide tracking information once your order is dispatched.",
    },
    {
      question: "Do you offer exchanges or returns?",
      answer:
        "Yes! We accept returns and exchanges within 7 days of delivery if items are unused with original tags. Customer pays return shipping costs unless the item is defective.",
    },
    {
      question: "How do I know what size to order?",
      answer:
        "Check our size guide available on each product page. We provide detailed measurements for chest, length, shoulder, and sleeve. If you're unsure, contact us for personalized sizing advice.",
    },
    {
      question: "Are your products authentic?",
      answer:
        "Absolutely! We source all our products from trusted suppliers and guarantee 100% authenticity. Every item comes with quality assurance.",
    },
    {
      question: "Do you ship outside Myanmar?",
      answer:
        "Currently, we only ship within Myanmar. We're working on international shipping options - stay tuned for updates!",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive a confirmation message with tracking details. You can also check your order status by logging into your account.",
    },
    {
      question: "What if an item is out of stock?",
      answer:
        "Out of stock items are clearly marked. You can contact us to check when items will be restocked or request notifications for when they become available again.",
    },
    {
      question: "Do you offer bulk discounts?",
      answer:
        "Yes! We offer special pricing for bulk orders (5+ pieces). Contact us directly for wholesale pricing and custom orders.",
    },
    {
      question: "How do I contact customer service?",
      answer:
        "You can reach us through our contact page, send us a message on Facebook, or call our hotline. We respond to all inquiries within 24 hours.",
    },
    {
      question: "Do you have a physical store?",
      answer:
        "We're primarily online-based to offer you the best prices, but we do have a showroom in Yangon by appointment. Contact us to schedule a visit.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Frequently Asked Questions
          </h1>

          <p className="text-gray-600 mb-8">
            Got questions? We've got answers! Find the most common questions
            about our products, orders, and services below.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800">
                    {faq.question}
                  </span>
                  <span className="text-2xl text-gray-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our friendly customer service
              team is here to help!
            </p>
            <button
              onClick={() => (window.location.href = "/contact")}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
