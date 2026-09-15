FROM eclipse-temurin:21-jre

WORKDIR /app

COPY target/eureka-server-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 3030

ENTRYPOINT ["java", "-jar", "app.jar"]