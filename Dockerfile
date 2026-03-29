# Build stage
FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app

# Copy only backend project
COPY University /app

# Now pom.xml is directly inside /app
RUN mvn clean package

# Package stage
FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=build /app/target/University-0.0.1-SNAPSHOT.jar demo.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","demo.jar"]