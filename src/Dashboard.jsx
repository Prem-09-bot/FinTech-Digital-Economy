import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscriptions when page loads
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Dashboard Logic: Fetch data from backend
  const fetchSubscriptions = async () => {
    try {
      const res = await axios.get("https://fintech-digital-economy.onrender.com/subscriptions");
      setSubscriptions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Dashboard Logic: Calculate total monthly spending
  const totalMonthly = subscriptions.reduce((total, sub) => {
    return total + Number(sub.cost);
  }, 0);

  // Alert Logic: Check how many days left before renewal
  const checkAlerts = (date) => {
    const today = new Date();
    const renewal = new Date(date);

    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return (
    <div className="dashboard">

      <h2>Subscription Dashboard</h2>

      <h3>Total Monthly Spend: ₹{totalMonthly}</h3>

      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Cost</th>
            <th>Billing</th>
            <th>Renewal</th>
            <th>Category</th>
            <th>Alert</th>
          </tr>
        </thead>

        <tbody>
          {subscriptions.map((sub) => {

            const daysLeft = checkAlerts(sub.renewalDate);

            return (
              <tr key={sub._id}>
                <td>{sub.name}</td>
                <td>₹{sub.cost}</td>
                <td>{sub.billingCycle}</td>
                <td>{new Date(sub.renewalDate).toLocaleDateString()}</td>
                <td>{sub.category}</td>

                <td>
                  {daysLeft <= 3 && daysLeft >= 0 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      ⚠ Renews in {daysLeft} days
                    </span>
                  ) : (
                    "No Alert"
                  )}
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>

    </div>
  );
}

export default Dashboard;