import React from "react";

function BillingDetailForm() {
  return (
    <div className="max-w-2xl w-full sm:w-[50%] mx-auto p-6 bg-white -lg shadow-md space-y-6 border">
      <h2 className="text-2xl font-semibold">Billing & Delivery Details</h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          placeholder="+95 9 123 456 789"
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Region Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Region <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full border border-gray-300  px-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled className="">
            Select Region
          </option>
          <option value="yangon">Yangon</option>
          <option value="mandalay">Mandalay</option>
          <option value="naypyitaw">Naypyitaw</option>
          <option value="bago">Bago</option>
          <option value="shan">Shan</option>
        </select>
      </div>

      {/* Deliver to City Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Deliver to City <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>
            Select City
          </option>
          <option value="yangon">Yangon (+3,000 MMK)</option>
          <option value="mandalay">Mandalay (+5,000 MMK)</option>
          <option value="naypyitaw">Naypyitaw (+6,000 MMK)</option>
          <option value="others">Other (Calculated at checkout)</option>
        </select>
      </div>

      {/* Township */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Township <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Hlaing, Sanchaung, etc."
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="House number and street name"
          rows="3"
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Order Notes <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <textarea
          placeholder="Any specific instructions or notes?"
          rows="2"
          className="w-full border border-gray-300  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Payment Methods */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" className="accent-blue-600" />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" className="accent-blue-600" />
            <span>KBZ Pay</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default BillingDetailForm;
