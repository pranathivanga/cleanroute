package com.cleanroute.controller;

import com.cleanroute.service.WeatherService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @GetMapping
    public String getWeather(
            @RequestParam("city") String city) {

        return weatherService.getWeather(city);
    }
}