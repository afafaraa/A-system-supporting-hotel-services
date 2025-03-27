FROM azul/zulu-openjdk-alpine:21.0.6

WORKDIR /app

RUN apk add --no-cache tzdata

COPY build/libs/MyHotelAssistant-*.jar MyHotelAssistant.jar

EXPOSE 8080

CMD ["java", "-jar", "-XX:+UseContainerSupport", "-Djava.security.egd=file:/dev/urandom", "/app/MyHotelAssistant.jar"]
