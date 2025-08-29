import React from "react";

function BillingDetailForm({
  formData = {},
  onChange = () => {},
  errors = {},
}) {
  return (
    <div className="max-w-2xl w-full sm:w-[50%] mx-auto p-6 bg-white shadow-md space-y-6 border">
      <h2 className="text-2xl font-semibold">Billing & Delivery Details</h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={onChange}
          placeholder="you@example.com"
          className={`w-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={onChange}
          placeholder="+95 9 123 456 789"
          className={`w-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Region Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Region <span className="text-red-500">*</span>
        </label>
        <select
          name="region"
          value={formData.region || ""}
          onChange={onChange}
          className={`w-full border px-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.region ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled>
            Select Region
          </option>
          <option value="yangon">Yangon</option>
          <option value="mandalay">Mandalay</option>
          <option value="naypyitaw">Naypyitaw</option>
          <option value="bago">Bago</option>
          <option value="shan">Shan</option>
        </select>
        {errors.region && (
          <p className="text-red-500 text-xs mt-1">{errors.region}</p>
        )}
      </div>

      {/* Deliver to City Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Deliver to City <span className="text-red-500">*</span>
        </label>
        <select
          name="city"
          value={formData.city || ""}
          onChange={onChange}
          className={`w-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.city ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="" disabled>
            Select City
          </option>
          <option value="yangon">Yangon (+3,000 MMK)</option>
          <option value="mandalay">Mandalay (+5,000 MMK)</option>
          <option value="naypyitaw">Naypyitaw (+6,000 MMK)</option>
          <option value="others">Other (Calculated at checkout)</option>
        </select>
        {errors.city && (
          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
        )}
      </div>

      {/* Township */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Township <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="township"
          value={formData.township || ""}
          onChange={onChange}
          placeholder="Hlaing, Sanchaung, etc."
          className={`w-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.township ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.township && (
          <p className="text-red-500 text-xs mt-1">{errors.township}</p>
        )}
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          name="fullAddress"
          value={formData.fullAddress || ""}
          onChange={onChange}
          placeholder="House number and street name"
          rows="3"
          className={`w-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullAddress ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.fullAddress && (
          <p className="text-red-500 text-xs mt-1">{errors.fullAddress}</p>
        )}
      </div>

      {/* Order Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Order Notes <span className="text-gray-500 text-sm">(optional)</span>
        </label>
        <textarea
          name="orderNotes"
          value={formData.orderNotes || ""}
          onChange={onChange}
          placeholder="Any specific instructions or notes?"
          rows="2"
          className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Payment Methods */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === "cod"}
              onChange={onChange}
              className="accent-blue-600"
            />
            <span>Cash on Delivery</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="paymentMethod"
              value="kbzpay"
              checked={formData.paymentMethod === "kbzpay"}
              onChange={onChange}
              className="accent-blue-600"
            />
            <span>KBZ Pay</span>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>
        )}
      </div>
    </div>
  );
}

export default BillingDetailForm;
