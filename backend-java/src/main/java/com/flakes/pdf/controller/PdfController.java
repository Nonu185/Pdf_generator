package com.flakes.pdf.controller;

import com.flakes.pdf.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    @PostMapping("/convert")
    public ResponseEntity<byte[]> convert(@RequestParam("images") List<MultipartFile> images) {
        try {
            byte[] pdfBytes = pdfService.convertImagesToPdf(images);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=converted.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/merge")
    public ResponseEntity<byte[]> merge(@RequestParam("pdfs") List<MultipartFile> pdfs) {
        try {
            byte[] pdfBytes = pdfService.mergePdfs(pdfs);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=merged.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/compress")
    public ResponseEntity<byte[]> compress(@RequestParam("pdf") MultipartFile pdf) {
        try {
            byte[] pdfBytes = pdfService.compressPdf(pdf);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=compressed.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/compress-image")
    public ResponseEntity<byte[]> compressImage(@RequestParam("image") MultipartFile image) {
        try {
            byte[] imageBytes = pdfService.compressImage(image);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=compressed.jpg")
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
