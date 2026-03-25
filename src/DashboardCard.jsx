<div className="glass shadow-lg p-5 hover:shadow-xl hover:scale-[1.02] transition">

<DashboardCard
title="Total Savings"
value={`₹${totalSavings.toFixed(2)}`}
color="text-green-500"
/>

<DashboardCard
title="Transactions"
value={transactions.length}
color="text-black"
/>

<DashboardCard
title="Today's Savings"
value={`₹${todaySavings}`}
color="text-blue-500"
/>

<DashboardCard
title="Predicted Spending"
value={`₹${predictedSpending.toFixed(2)}`}
color="text-orange-500"
/>

</div>
