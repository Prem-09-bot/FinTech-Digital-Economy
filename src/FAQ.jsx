import React, { useState } from "react";

function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      question: "How does Smart Savings work?",
      answer: "It tracks your transactions and helps you save money automatically."
    },
    {
      question: "Can I track subscriptions?",
      answer: "Yes, you can add and manage all your subscriptions in one place."
    },
    {
      question: "Is my financial data secure?",
      answer: "This demo stores data locally or in your backend server."
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">FAQ</h2>

      {faqs.map((faq, index) => (
        <div key={index} className="border-b py-3">
          <button
            className="w-full text-left font-semibold"
            onClick={() => setOpen(open === index ? null : index)}
          >
            {faq.question}
          </button>

          {open === index && (
            <p className="text-gray-600 mt-2">{faq.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQ;