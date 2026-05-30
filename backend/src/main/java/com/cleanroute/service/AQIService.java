package com.cleanroute.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AQIService {

    @Value("${openweather.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public String getAQI() {

        String url =
                "http://api.openweathermap.org/data/2.5/air_pollution?lat=17.3850&lon=78.4867&appid="
                        + apiKey;

        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }
}