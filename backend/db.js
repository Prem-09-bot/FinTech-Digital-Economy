const mongoose = require('mongoose');


const connectDB = async () => {
  await mongoose.connect('mongodb+srv://jeet713423:jeet123@cluster0.mongodb.net/savingsDB?retryWrites=true&w=majority').then(() => console.log("Db connected"))
}

module.exports=connectDB;