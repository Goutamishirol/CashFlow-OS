# Stage 1: Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /app

# Copy Maven wrapper files
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn/ .mvn/
COPY pom.xml .

# Copy source code
COPY src/ src/

# Build the application (skip tests for faster builds)
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose default port (Render will pass PORT env var at runtime)
EXPOSE 8080

# Run the application
# Spring Boot reads server.port=${PORT:8080} from application.properties
# Render sets PORT env var, which will override the default 8080
CMD ["java", "-jar", "app.jar"]
