import React from "react";
import { Doughnut } from "react-chartjs-2";

function SpendingChart({ subscriptions }) {
  // Calculate subscription names and amounts
  const labels = subscriptions.map((s) => s.name);
  const dataValues = subscriptions.map((s) => s.amount);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          "#34d399", // green
          "#3b82f6", // blue
          "#fbbf24", // yellow
          "#f87171", // red
          "#a78bfa", // purple
          "#f472b6", // pink
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending</h3>
      {subscriptions.length > 0 ? (
        <Doughnut data={data} />
      ) : (
        <p className="text-gray-500">No subscriptions yet.</p>
      )}
    </div>
  );
}

export default SpendingChart;