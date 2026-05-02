package com.flakes.pdf.service;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.multipdf.PDFMergerUtility;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

/**
 * Service class for handling PDF and Image operations.
 */
@Service
public class PdfService {

    @Value("${ghostscript.path}")
    private String gsPath;

    /**
     * Converts a list of uploaded images into a single PDF document.
     * Each image is placed on a new page matching the image dimensions.
     */
    public byte[] convertImagesToPdf(List<MultipartFile> images) throws IOException {
        try (PDDocument document = new PDDocument()) {
            for (MultipartFile file : images) {
                // Only process image files
                if (file.getContentType() != null && file.getContentType().startsWith("image/")) {
                    BufferedImage bimg = ImageIO.read(file.getInputStream());
                    if (bimg == null) continue;

                    // Create a page with the same dimensions as the image
                    float width = bimg.getWidth();
                    float height = bimg.getHeight();
                    PDPage page = new PDPage(new PDRectangle(width, height));
                    document.addPage(page);

                    // Add the image to the page
                    PDImageXObject pdImage = LosslessFactory.createFromImage(document, bimg);
                    try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                        contentStream.drawImage(pdImage, 0, 0, width, height);
                    }
                }
            }
            // Return the PDF as a byte array
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    /**
     * Merges multiple PDF files into one single PDF document.
     */
    public byte[] mergePdfs(List<MultipartFile> pdfs) throws IOException {
        PDFMergerUtility merger = new PDFMergerUtility();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        merger.setDestinationStream(baos);

        for (MultipartFile pdf : pdfs) {
            if ("application/pdf".equals(pdf.getContentType())) {
                // PDFBox 3.x requires RandomAccessReadBuffer for input streams
                merger.addSource(new RandomAccessReadBuffer(pdf.getInputStream()));
            }
        }
        // Merge all sources into the destination stream
        merger.mergeDocuments(null);
        return baos.toByteArray();
    }

    /**
     * Compresses a PDF file using Ghostscript.
     * Ghostscript must be installed on the host system.
     */
    public byte[] compressPdf(MultipartFile pdf) throws IOException {
        String uniqueId = UUID.randomUUID().toString();
        Path inputPath = Files.createTempFile("input-" + uniqueId, ".pdf");
        Path outputPath = Files.createTempFile("output-" + uniqueId, ".pdf");

        try {
            // Save the uploaded file temporarily
            Files.write(inputPath, pdf.getBytes());

            // Build the Ghostscript command for compression
            ProcessBuilder pb = new ProcessBuilder(
                    gsPath,
                    "-sDEVICE=pdfwrite",
                    "-dCompatibilityLevel=1.4",
                    "-dPDFSETTINGS=/screen", // Optimized for screen viewing (smaller size)
                    "-dNOPAUSE", "-dQUIET", "-dBATCH",
                    "-sOutputFile=" + outputPath.toAbsolutePath(),
                    inputPath.toAbsolutePath().toString()
            );

            // Execute the command
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new IOException("Ghostscript failed with exit code " + exitCode);
            }

            // Read the compressed file back
            return Files.readAllBytes(outputPath);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Compression interrupted", e);
        } finally {
            // Clean up temporary files
            Files.deleteIfExists(inputPath);
            Files.deleteIfExists(outputPath);
        }
    }

    /**
     * Compresses an image by resizing it and reducing JPEG quality.
     */
    public byte[] compressImage(MultipartFile image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Use Thumbnailator for easy image processing
        Thumbnails.of(image.getInputStream())
                .size(800, 800)        // Max dimensions
                .outputQuality(0.6)     // 60% quality
                .outputFormat("jpg")
                .toOutputStream(baos);
        return baos.toByteArray();
    }
}
