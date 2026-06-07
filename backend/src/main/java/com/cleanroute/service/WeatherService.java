package com.cleanroute.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public String getWeather(String city) {

        String url =
                "https://api.openweathermap.org/data/2.5/weather?q="
                        + city
                        + "&appid="
                        + apiKey
                        + "&units=metric";

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }
    public JsonNode getWeatherData(
            double lat,
            double lon) {

        String url =
                "https://api.openweathermap.org/data/2.5/weather?lat="
                        + lat
                        + "&lon="
                        + lon
                        + "&appid="
                        + apiKey
                        + "&units=metric";

        String response = restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);

        try {

            ObjectMapper mapper =
                    new ObjectMapper();

            return mapper.readTree(response);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public double getTemperature(
            double lat,
            double lon) {

        return getWeatherData(lat, lon)
                .path("main")
                .path("temp")
                .asDouble();
    }
    public int getHumidity(
            double lat,
            double lon) {

        return getWeatherData(lat, lon)
                .path("main")
                .path("humidity")
                .asInt();
    }
    public double getWindSpeed(
            double lat,
            double lon) {

        return getWeatherData(lat, lon)
                .path("wind")
                .path("speed")
                .asDouble();
    }
}