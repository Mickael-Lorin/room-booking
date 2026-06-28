FROM maven:3.9.15-eclipse-temurin-25

WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY backend/pom.xml .
COPY backend/ ./src/

COPY . .

RUN chmod +x mvnw

EXPOSE 8080


CMD ["./mvnw", "spring-boot:run"]