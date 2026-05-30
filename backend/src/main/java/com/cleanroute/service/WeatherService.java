package com.cleanroute.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

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
}