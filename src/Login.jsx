import React, { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleLogin = async (e) => {
  e.preventDefault();

const API = "https://fintech-digital-economy-1.onrender.com";

  const cleanEmail = email.trim();
  const cleanPassword = password.trim();

  console.log("EMAIL:", cleanEmail);
  console.log("PASSWORD:", cleanPassword);

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: cleanEmail,
      password: cleanPassword
    })
  });

  let data = [];
try {
  data = await res.json();
} catch (err) {
  console.error("Invalid JSON:", err);
}

  if (res.ok) {
    localStorage.setItem("token", data.token);
    setIsLoggedIn(true);
  } else {
    alert(data.message || "Login failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">

      <div className="glass shadow-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Smart Savings Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition"
          >
            Login
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Demo: admin@gmail.com / 1234
        </p>

      </div>
    </div>
  );
}

export default Login;
