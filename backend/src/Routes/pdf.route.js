const express = require("express");
const multer = require("multer");
const router = express.Router();
const PDFDocument = require("pdfkit");
const { PDFDocument: PdfLibDocument } = require("pdf-lib");

const upload = multer({ storage: multer.memoryStorage(),
    limits:{fileSize:20 * 1024 * 1024}
 });

//convert images to pdf
router.post("/convert", upload.array("images", 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }
    const doc = new PDFDocument({ autoFirstPage: false });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");

    doc.pipe(res);

    for (const file of req.files) {
      try {
        if (!file.mimetype.startsWith("image/")) {
          console.log("Skipped:", file.originalname);
          continue;
        }
        const img = doc.openImage(file.buffer);

        doc.addPage({ size: [img.width, img.height] });

        doc.image(img, 0, 0, {
          width: img.width,
          height: img.height,
        });
      } catch (err) {
        console.log(" Error processing:", file.originalname);
      }
    }
    doc.end();
  } catch (error) {
    console.log(" MAIN ERROR:", error.message);

    if (!res.headersSent) {
      res.status(500).json({ message: "Error converting images" });
    }
  }
});


//compress pdf
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

router.post("/compress", upload.single("pdf"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

 const uniqueId = Date.now();

const inputPath = path.join(__dirname, `input-${uniqueId}.pdf`);
const outputPath = path.join(__dirname, `output-${uniqueId}.pdf`);
    // Save uploaded PDF temporarily
    fs.writeFileSync(inputPath, req.file.buffer);

    // Ghostscript command
    const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
-dPDFSETTINGS=/screen \
-dNOPAUSE -dQUIET -dBATCH \
-sOutputFile="${outputPath}" "${inputPath}"`;

    exec(command, (error) => {
      if (error) {
        console.log("Ghostscript error:", error);
        return res.status(500).json({ message: "Compression failed" });
      }

      // Read compressed file
      const compressedPdf = fs.readFileSync(outputPath);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=compressed.pdf"
      );

      res.end(compressedPdf);

      // Cleanup temp files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });

  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//Compress image

const sharp = require("sharp");

router.post("/compress-image", upload.single("image"), async (req, res) => {
  console.log(" Image Compress API HIT");

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    
    const quality = 60;

    // Compress image
    const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) 
      .jpeg({ quality })      
      .toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=compressed.jpg"
    );

    res.end(compressedBuffer);

  } catch (error) {
    console.log(" Image compress error:", error.message);
    res.status(500).json({ message: "Error compressing image" });
  }
});

//merge pdfs

router.post("/merge", upload.array("pdfs", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No PDFs uploaded" });
    }

    // Create new PDF
    const mergedPdf = await PdfLibDocument.create();

    for (const file of req.files) {
      try {
        if (file.mimetype !== "application/pdf") {
          console.log("Skipped:", file.originalname);
          continue;
        }

        const pdf = await PdfLibDocument.load(file.buffer);

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => mergedPdf.addPage(page));

      } catch (err) {
        console.log("Error merging:", file.originalname);
      }
    }

    const pdfBytes = await mergedPdf.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=merged.pdf"
    );

    res.end(Buffer.from(pdfBytes));

  } catch (error) {
    console.log(" Merge error:", error.message);
    res.status(500).json({ message: "Error merging PDFs" });
  }
});

 module.exports = router;
