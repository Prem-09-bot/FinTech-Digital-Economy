import React, { useState } from "react";

function SubscriptionForm({ subscriptions, setSubscriptions }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Calculate total subscriptions
  const totalSubscription = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.amount || 0),
    0
  );

  const addSubscription = () => {
    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedName || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Enter a valid subscription name and amount");
      return;
    }

    const newSub = {
      id: Date.now(),
      name: trimmedName,
      amount: parsedAmount,
      renewalDate: new Date().toISOString().split("T")[0]
    };

    setSubscriptions([...subscriptions, newSub]);

    setName("");
    setAmount("");
  };

  const deleteSubscription = (id) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    setSubscriptions(updated);
  };

  return (
    <div className="glass shadow-lg p-6 mb-8">

      {/* Header */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Add Subscription
      </h3>

      {/* Input Section */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <input
          type="text"
          placeholder="Subscription Name"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
          onClick={addSubscription}
        >
          Add
        </button>
      </div>

      {/* Total Subscription Card */}
      <div className="bg-gray-50 rounded-xl p-5 mb-5">
        <h3 className="text-gray-500 text-sm">Monthly Subscriptions</h3>
        <h1 className="text-3xl font-bold text-purple-500">
          ₹{totalSubscription.toFixed(2)}
        </h1>
      </div>

      {/* Subscription List */}
      {subscriptions.length > 0 && (
        <ul className="space-y-3">
          {subscriptions.map((sub) => (
            <li
              key={sub.id}
              className="flex justify-between items-center bg-gray-50 border p-3 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold">{sub.name}</p>
                <p className="text-gray-500 text-sm">
                  Renewal: {sub.renewalDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-green-600">
                  ₹{Number(sub.amount || 0).toFixed(2)}
                </span>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  onClick={() => deleteSubscription(sub.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubscriptionForm;
