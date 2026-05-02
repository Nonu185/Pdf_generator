# Flakes.pdf - Spring Boot Backend

This is the Java-based backend for the **Flakes.pdf** application, built with **Spring Boot 3.3.0** and **MongoDB**. It provides a robust and secure API for PDF manipulation and user management.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).
- **Image to PDF:** Convert multiple images (JPG, PNG) into a single PDF document.
- **Merge PDFs:** Combine multiple PDF files into one.
- **PDF Compression:** Reduce PDF file size using Ghostscript integration.
- **Image Compression:** Optimize images by reducing quality and dimensions.

## 🛠️ Technology Stack

- **Java 17+**: Core programming language.
- **Spring Boot 3**: Framework for building the REST API.
- **Spring Security**: Handles JWT-based authentication and CORS.
- **Spring Data MongoDB**: Object-document mapping for MongoDB Atlas.
- **Apache PDFBox 3.x**: Powerful library for PDF creation and manipulation.
- **Thumbnailator**: Easy-to-use library for image processing.
- **Ghostscript**: External system tool for advanced PDF compression.

## 📂 Project Structure

```text
src/main/java/com/flakes/pdf/
├── config/             # Configuration classes (Security, CORS)
├── controller/         # REST Controllers (API Endpoints)
├── model/              # Data Models (Entities)
├── repository/         # Data Access Layer (MongoDB Repositories)
├── security/           # JWT & Security Logic (Filters, Utils)
└── service/            # Business Logic (PDF Processing, Auth)
```

## ⚙️ Prerequisites

- **Java 17** installed.
- **Maven** installed.
- **Ghostscript** installed on your system (run `gs --version` to check).
- **MongoDB Atlas** account (or local MongoDB).

## 🔧 Setup & Installation

1. **Configure Environment:**
   Update `src/main/resources/application.properties` with your MongoDB URI and JWT Secret:
   ```properties
   spring.data.mongodb.uri=your_mongodb_uri
   jwt.secret=your_secure_secret
   ```

2. **Build & Run:**
   ```bash
   mvn clean spring-boot:run
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new account.
- `POST /api/auth/login` - Login and receive a JWT token.

### PDF Operations
- `POST /api/pdf/convert` - Convert images to PDF.
- `POST /api/pdf/merge` - Merge multiple PDFs.
- `POST /api/pdf/compress` - Compress a PDF file.
- `POST /api/pdf/compress-image` - Compress an image file.

## 🛡️ Security
The API uses **Stateless JWT Authentication**. All PDF operations are protected and require a `Bearer <token>` header, unless configured otherwise in `SecurityConfig.java`.

## 📄 License
This project is for educational/personal use.
