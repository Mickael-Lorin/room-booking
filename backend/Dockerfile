# ── Stage 1 : Build ──────────────────────────────────────────────────────────
FROM maven:3.9.15-eclipse-temurin-25 AS build

WORKDIR /app

# Copie uniquement le pom.xml en premier pour mettre les dépendances en cache.
# Tant que pom.xml ne change pas, Docker réutilise ce layer sans re-télécharger.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie le code source et compile
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2 : Runtime ────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk-noble

WORKDIR /app

COPY --from=build /app/target/room-booking-*.jar app.jar

EXPOSE 10000

ENTRYPOINT ["java", "-jar", "app.jar"]
