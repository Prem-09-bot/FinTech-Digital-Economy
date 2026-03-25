import React,{useState,useEffect, useCallback} from "react";
import "./App.css";
import "./index.css";

import {Bar, Doughnut } from "react-chartjs-2";
import SubscriptionForm from "./SubscriptionForm";
//import Dashboard from "./Dashboard";
import SpendingChart from "./SpendingChart";
import PiggyBank from "./PiggyBank"; 
import FAQ from "./FAQ";
import Footer from "./Footer";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Login from "./Login";



import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Title,
Tooltip,
Legend
);

function App(){

const API = "http://localhost:5000";
console.log("API BASE URL:", API);
const [transactions,setTransactions] = useState([]);
const safeTransactions = Array.isArray(transactions) ? transactions : [];
const [amount,setAmount] = useState("");
const todaySavings = safeTransactions.reduce((total, t) => total + Number(t.saved || 0), 0).toFixed(2);
const [subscriptions, setSubscriptions] = useState([]);
const [loading, setLoading] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [streak, setStreak] = useState(0);
const [isLoggedIn, setIsLoggedIn] = useState(false);


//fetch Transcation
const fetchTransactions = useCallback(async () => {
  const res = await fetch(`${API}/transactions`, {
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token")
    }
  });

  const data = await res.json();
  setTransactions(Array.isArray(data) ? data : []);
}, [API]);

//fetch Subscriptions
const fetchSubscriptions = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API}/subscriptions`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    setSubscriptions(Array.isArray(data) ? data : []);
  } catch (err) {
    console.log(err);
  }
  setLoading(false);
}, [API]);


useEffect(() => {
  if (isLoggedIn) {
    fetchTransactions();
    fetchSubscriptions();
  }
}, [isLoggedIn, fetchTransactions, fetchSubscriptions]);

//Add Transaction
const addTransaction = async () => {

  if (!amount || isNaN(amount)) {
    alert("Enter valid amount");
    return;
  }

  const res = await fetch(`${API}/transactions`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": "Bearer " + localStorage.getItem("token") // ✅ also needed
    },
    body:JSON.stringify({amount})
  });

  if (res.ok) {
    setAmount("");
    fetchTransactions();
    toast.success("Transaction Added!");
  } else {
    toast.error("Something went wrong!");
  }
};

//ClearTransaction
const clearTransactions =async () => {
try {
  await fetch(`${API}/transactions`, { method: "DELETE",   headers: {
    "Authorization": "Bearer " + localStorage.getItem("token")
  }
   });
  fetchTransactions();
} catch(err) {
  console.error(err);
  toast.error("Something went wrong!");
}
}

function getPredictionAdvice(totalSpending) {
  if (totalSpending < 500) {
    return  "Great job! Your spending is under control.";
  } 
  else if (totalSpending < 2000) {
    return "Moderate spending. Try saving more this month.";
  } 
  else {
    return "High spending detected. Consider reducing subscriptions.";
  }
}

const totalSavings =
safeTransactions.reduce((sum, t) => sum + Number(t.saved || 0), 0);

const chartData = {
labels: safeTransactions.map((t,i)=>"T"+(i+1)),
datasets:[
{
label:"Savings",
data: safeTransactions.map(t=>t.saved),
backgroundColor: "#0e652e"
}
]
};

const goal = 1000;

const goalData = {
  labels: ["Saved", "Remaining"],
  datasets: [
    {
      data: [totalSavings, Math.max(goal - totalSavings, 0)],
      backgroundColor: ["#22c55e", "#e5e7eb"],
    },
  ],
};
const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

const totalSubscription = safeSubscriptions.reduce(
  (sum, sub) => sum + Number(sub.amount || 0),
  0
);

const predictedSpending = totalSubscription + totalSavings;

const progress =(totalSavings/goal)*100;

useEffect(() => {
  if (safeTransactions.length > 5) {
      setStreak(safeTransactions.length);
  }
}, [safeTransactions.length]);

useEffect(() => {
(Array.isArray(subscriptions) ? subscriptions : []).forEach((sub) => {
    if (sub.amount > 1000) {
      console.log("High subscription:", sub.name);
    }
  });
}, [subscriptions]);

if (!isLoggedIn) {
  return <Login setIsLoggedIn={setIsLoggedIn} />;
}

return (
<div className={
  darkMode 
  ? "flex flex-col md:flex-row min-h-screen bg-gray-900 text-white" 
  : "flex flex-col md:flex-row min-h-screen bg-gray-100"
}>

{/* Sidebar */}
<div
className={`bg-gray-900 text-white p-6 md:w-64 w-full absolute md:relative z-10 
${menuOpen ? "block" : "hidden"} md:block`}
>
<button
className="md:flex text-2xl"
onClick={() => setMenuOpen(!menuOpen)}
>
☰
</button>

<h2 className="text-2xl font-bold mb-10">Smart Savings</h2>
<ul className="space-y-4 text-gray-300">
<li className="hover:text-white cursor-pointer">Dashboard</li>
<li className="hover:text-white cursor-pointer"> Transactions</li>
<li className="hover:text-white cursor-pointer"> Analytics</li>
<li className="hover:text-white cursor-pointer"> Settings</li>
<button
className="bg-gray-200 px-3 py-1 rounded"
onClick={() => setDarkMode(!darkMode)}
>
{darkMode ? "☀ Light" : "🌙 Dark"}
</button>

{/*Logout*/}
<button
className="bg-red-500 text-white px-3 py-1 rounded"
onClick={() => setIsLoggedIn(false)}
>
Logout
</button>

</ul>
</div>

<div className="flex-1">

{/* Navbar */}
<div className="glass shadow-lg p-4 flex justify-between items-center">
<h2 className="text-xl font-semibold">Smart Savings Dashboard</h2>
<div className="flex items-center gap-4"></div>
<div className="text-gray-600">Welcome User</div>
<div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full"></div>
</div>

<div className="p-6">
  {loading && <p className="text-gray-600 text-lg mb-4">Loading...</p>}
  <h1 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">Dashboard</h1>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"></div>
</div>

{/*Floating Add button*/}
<button className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full text-3xl shadow-lg transition">
+
</button>

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">Dashboard</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="glass shadow-lg p-6">
<h3 className="text-gray-500">Total Savings</h3>
<h1 className="text-3xl font-bold text-green-500">₹{totalSavings.toFixed(2)}</h1>
</motion.div>

<div className="glass shadow-lg p-6">
<h3 className="text-gray-500">Transactions</h3>
<h1 className="text-3xl font-bold">{safeTransactions.length}</h1>
</div>

<div className="glass shadow-lg p-6">
<h3 className="text-gray-500">Today's Savings</h3>
<h1 className="text-3xl font-bold text-blue-500">₹{todaySavings}</h1>
</div>

<div className="glass shadow-lg p-5">
  <h3 className="text-gray-500"> Saving Streak</h3>
  <h1 className="text-3xl font-bold text-red-500">
    {streak} Days
  </h1>
</div>

<div className="glass shadow-lg p-6">
<h3 className="text-gray-500">AI Advisor</h3>
<p className="text-gray-600">
{getPredictionAdvice(totalSubscription)}
</p>
</div>

<div className="glass shadow-lg p-6">
<h3 className="text-gray-500">Predicted Monthly Spending</h3>
<h1 className="text-3xl font-bold text-orange-500">
₹{predictedSpending.toFixed(2)}
</h1>
<p className="text-gray-600 mt-2">{getPredictionAdvice(predictedSpending)}</p>
</div>

<PiggyBank totalSavings={totalSavings} goal={goal} />

<div className="mt-4">
<p className="text-gray-600 mb-1">Goal Progress: {progress.toFixed(2)}%</p>
<div className="w-full bg-gray-300 rounded-full h-4">
<div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
</div>
<p className="text-sm mt-1">{progress.toFixed(0)}% of goal</p>
</div>

</div>

{/*Chart section*/}
<div className="grid md:grid-cols-2 gap-6 mb-8">

<div className="glass shadow-lg p-6"
>
<h3 className="text-lg font-semibold mb-4">Savings Overview</h3>
<Bar data={chartData}/>
</div>

<div className="glass shadow-lg p-6">
<h3 className="text-lg font-semibold mb-4">Goal Tracker</h3>
<Doughnut data={goalData}/>
</div>

<SpendingChart subscriptions={subscriptions} />

</div>

<div className="glass shadow-lg p-6">
<h3 className="text-lg font-semibold mb-4">Add Transaction</h3>

<input
className="border p-2 rounded mr-2"
type="number"
placeholder="Enter transaction"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<button
className="bg-green-500 text-white px-4 py-2 rounded mr-2"
onClick={addTransaction}
>
Add
</button>

<button
className="bg-red-500 text-white px-4 py-2 rounded"
onClick={clearTransactions}
>
Clear
</button>

</div>

<div className="p-6">
<SubscriptionForm
subscriptions={subscriptions}
setSubscriptions={setSubscriptions}
/>
</div>

<FAQ />
<Footer />
<Toaster />


</div>
</div>
</div>
)

}

export default App;