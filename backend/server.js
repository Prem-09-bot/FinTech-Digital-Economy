const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Subscription = require("./models/Subscription");
const Transaction = require("./models/Transactions");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


// =====================
// 🔐 USER MODEL
// =====================
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);


// =====================
// 🔐 AUTH MIDDLEWARE
// =====================
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("AUTH HEADER:", authHeader); // debug

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  // 🔥 MUST split Bearer token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};


// =====================
// 🔐 REGISTER
// =====================
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashed });
    await user.save();

    res.json({ message: "User registered" });

  } catch (err) {
    res.status(500).json(err);
  }
});


// =====================
// 🔐 LOGIN
// =====================
app.post("/login", async (req, res) => {
  console.log("RAW BODY:", req.body);
  console.log("TYPE:", typeof req.body.email);

  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  console.log("FINAL EMAIL:", `"${email}"`);
  console.log("FINAL PASSWORD:", `"${password}"`);

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (email === "admin@gmail.com" && password === "1234") {
    const token = jwt.sign(
      { id: "test-user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }

  return res.status(400).json({ message: "Invalid credentials" });
});

// =====================
// 🔒 PROTECTED ROUTES
// =====================

// Subscriptions (Protected)
app.post("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const newSub = new Subscription({
      ...req.body,
      userId: req.userId
    });
    await newSub.save();
    res.json(newSub);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId });
    res.json(subs);
  } catch (error) {
    res.status(500).json(error);
  }
});


// Transactions (Protected)
app.post("/transactions", authMiddleware, async (req,res)=>{

  const {amount} = req.body;

  const saving = Math.ceil(amount) - amount;

  const transaction = new Transaction({
    amount,
    roundUp: Math.ceil(amount),
    saved: saving,
    userId: req.userId
  });

  await transaction.save();
  res.json(transaction);
});

app.get("/transactions", authMiddleware, async (req,res)=>{
  const transactions = await Transaction.find({ userId: req.userId });
  res.json(transactions);
});

app.delete("/clear", authMiddleware, async(req, res)=>{
  await Transaction.deleteMany({ userId: req.userId });
  res.send("Transactions cleared!");
});


// =====================
// BASIC ROUTE
// =====================
app.get("/", (req,res)=>{
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`);
});

