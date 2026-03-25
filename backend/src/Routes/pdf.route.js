const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const { PDFDocument: PdfLibDocument } = require("pdf-lib"); // alias to avoid conflict with pdfkit

const router = express.Router();

// Use memory storage for immediately processing the buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/convert", upload.array("images", 50), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images provided" });
        }

        // Initialize PDF document
        // autoFirstPage: false so that we can add pages with exact image dimensions
        const doc = new PDFDocument({ autoFirstPage: false });

        // Set headers to prompt download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="converted.pdf"');

        // Pipe the PDF document directly to the response
        doc.pipe(res);

        for (const file of req.files) {
            // Get image buffer
            const img = doc.openImage(file.buffer);
            
            // Add a new page matching the image dimensions
            doc.addPage({ size: [img.width, img.height] });
            
            // Draw the image to fit the page exactly
            doc.image(img, 0, 0, { width: img.width, height: img.height });
        }

        // Finalize the PDF
        doc.end();
    } catch (error) {
        console.error("PDF generation error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate PDF" });
        }
    }
});

router.post("/merge", upload.array("pdfs", 20), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No PDFs provided" });
        }

        const mergedPdf = await PdfLibDocument.create();
        for (const file of req.files) {
            const pdf = await PdfLibDocument.load(file.buffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const pdfBytes = await mergedPdf.save();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="merged.pdf"');
        res.end(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("PDF merge error:", error);
        res.status(500).json({ error: "Failed to merge PDFs" });
    }
});

router.post("/compress", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No PDF provided" });
        }

        const pdf = await PdfLibDocument.load(req.file.buffer);
        // Compressing by resaving without object streams often removes unused metadata
        const pdfBytes = await pdf.save({ useObjectStreams: false }); 

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="compressed.pdf"');
        res.end(Buffer.from(pdfBytes));
    } catch (error) {
        console.error("PDF compress error:", error);
        res.status(500).json({ error: "Failed to compress PDF" });
    }
});

module.exports = router;
