package com.cleanroute.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AQIService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public int getAQI(
            double lat,
            double lon) {

        String url =
                "http://api.openweathermap.org/data/2.5/air_pollution?lat="
                        + lat
                        + "&lon="
                        + lon
                        + "&appid="
                        + apiKey;

        String response = restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);

        try {

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode root =
                    mapper.readTree(response);

            return root.path("list")
                    .get(0)
                    .path("main")
                    .path("aqi")
                    .asInt();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}