const express = require("express")
const cors = require("cors");
const app = express();
const multer = require("multer");
const authRoutes = require("./Routes/auth.route");
const pdfRoutes = require("./Routes/pdf.route.js");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes); 
app.use("/api/pdf", pdfRoutes);
app.use((err, req, res, next) => {
  console.log(" GLOBAL ERROR:", err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: "File upload error",
      error: err.message,
    });
  }

  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
})

module.exports = app;