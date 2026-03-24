import React from "react";

function PiggyBank({ totalSavings, goal }) {
  const progress = Math.min((totalSavings / goal) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition
 text-center">
      <h3 className="text-lg font-semibold mb-4">Piggy Bank</h3>
      <div className="relative w-32 h-32 mx-auto mb-4">
        <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-end">
          <div
            className="bg-pink-500 w-full transition-all duration-500"
            style={{ height: `${progress}%` }}
          ></div>
        </div>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
          ₹{totalSavings.toFixed(2)}
        </span>
      </div>
      <p className="text-gray-600">Goal: ₹{goal}</p>
      <p className="text-gray-500 mt-2">{progress.toFixed(0)}% filled</p>
    </div>
  );
}

export default PiggyBank;