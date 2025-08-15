import React from "react";

function OrderDetail() {
  return (
    <div className="sm:w-[50%] w-full p-6 shadow-md space-y-6 border bg-gray-100 rounded">
      <h2 className="text-2xl font-semibold">Your Order</h2>

      {/* Product List */}
      <div className="space-y-4 border-t border-b py-4">
        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium">T-SHIRT BROWN - MEDIUM</p>
            <p className="text-gray-500">× 1</p>
          </div>
          <p className="font-medium">54,000 MMK</p>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <p className="font-medium">T-SHIRT BLACK - MEDIUM</p>
            <p className="text-gray-500">× 1</p>
          </div>
          <p className="font-medium">54,000 MMK</p>
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">108,000 MMK</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Deliver to City (YANGON)</span>
          <span className="font-medium">3,000 MMK</span>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <span>Total</span>
          <span>111,000 MMK</span>
        </div>
      </div>

      {/* Notice */}
      <div className="text-xs text-gray-600 mt-4 space-y-2">
        <p>
          Your personal data will be used to process your order, support your
          experience throughout this website, and for other purposes described
          in our{" "}
          <a
            href="/privacy-policy"
            className="underline text-blue-600 hover:text-blue-800"
          >
            privacy policy
          </a>
          .
        </p>
        <p className="text-red-500 font-medium">
          Please carefully double-check your order.*
        </p>
        <p className="text-gray-700 font-medium">
          Once you place this order, your order can’t be exchanged or canceled.
          All sales are final.
        </p>
      </div>

      {/* Place Order Button */}
      <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition rounded hover:cursor-pointer">
        Place Order
      </button>
    </div>
  );
}

export default OrderDetail;
