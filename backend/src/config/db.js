const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        console.error("Hint: Check if your MongoDB Atlas IP address is whitelisted, or if your password is correct.");
        process.exit(1);
    }
}

module.exports = connectDB;