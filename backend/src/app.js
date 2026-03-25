const express = require("express")
const cors = require("cors");
const app = express();


const authRoutes = require("./Routes/auth.route");
const pdfRoutes = require("./Routes/pdf.route");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes); 
app.use("/api/pdf", pdfRoutes);

module.exports = app;