require("dotenv").config();
console.log("ENV CHECK:", process.env.MONGO_URI);
const app = require("./src/app.js")
const connectDB = require("./src/config/db.js")

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)

})