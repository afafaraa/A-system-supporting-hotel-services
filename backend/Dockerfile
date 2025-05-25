FROM gradle:jdk21 AS builder
ENV GRADLE_OPTS="-Dorg.gradle.daemon=false -Dorg.gradle.parallel=true -Dorg.gradle.caching=true -Dorg.gradle.configureondemand=true -Dorg.gradle.jvmargs=-Xmx2048m"
WORKDIR /build

COPY gradle ./gradle
COPY build.gradle settings.gradle gradlew gradlew.bat ./

RUN gradle dependencies --no-daemon --parallel --build-cache

COPY src ./src

RUN gradle bootJar -x test --no-daemon --parallel --build-cache

FROM azul/zulu-openjdk-alpine:21.0.6
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"
WORKDIR /app

COPY --from=builder /build/build/libs/*.jar app.jar

EXPOSE 8080

CMD java $JAVA_OPTS -jar app.jar
