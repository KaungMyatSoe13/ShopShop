import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Welcome to our streetwear collection - your go-to destination for
              fresh, urban fashion in Yangon, Myanmar.
            </p>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Our Story
              </h2>
              <p>
                Founded with a passion for street culture and contemporary
                fashion, we bring you carefully curated pieces that represent
                the vibrant spirit of Myanmar's youth. From the bustling streets
                of Yangon to the creative energy of our local community, we
                celebrate style that speaks to the modern generation.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                What We Offer
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium quality streetwear and casual clothing</li>
                <li>Trendy t-shirts, sweaters, and accessories</li>
                <li>
                  Carefully selected pieces that blend international style with
                  local flair
                </li>
                <li>Affordable prices for quality fashion</li>
                <li>Fast delivery across Yangon and major cities in Myanmar</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Our Mission
              </h2>
              <p>
                To provide young people in Myanmar with access to quality
                streetwear that allows them to express their individuality and
                connect with global fashion trends while staying true to their
                roots.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Why Choose Us?
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Local business supporting the Myanmar community</li>
                <li>Authentic products with quality guarantee</li>
                <li>Friendly customer service in Myanmar language</li>
                <li>Understanding of local style preferences</li>
                <li>Commitment to customer satisfaction</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Get in Touch
              </h3>
              <p>
                Have questions about our products or need styling advice? We're
                here to help! Reach out to us and become part of our growing
                streetwear community in Yangon.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
