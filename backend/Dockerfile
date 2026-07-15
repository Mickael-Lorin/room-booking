FROM maven:3.9.15-eclipse-temurin-25

WORKDIR /app

COPY . .

RUN chmod +x mvnw

EXPOSE 8080

CMD ["./mvnw", "spring-boot:run"]