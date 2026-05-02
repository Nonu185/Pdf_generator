# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app

# Install Ghostscript for PDF compression
RUN apt-get update && apt-get install -y ghostscript && rm -rf /var/lib/apt/lists/*

COPY --from=build /target/pdf-0.0.1-SNAPSHOT.jar app.jar

# Set the Ghostscript path for the application
ENV GS_PATH=/usr/bin/gs

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
