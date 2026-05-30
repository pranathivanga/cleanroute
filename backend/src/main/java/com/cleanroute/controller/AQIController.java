package com.cleanroute.controller;

import com.cleanroute.service.AQIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aqi")
public class AQIController {

    private final AQIService aqiService;

    public AQIController(AQIService aqiService) {
        this.aqiService = aqiService;
    }

    @GetMapping
    public String getAQI() {
        return aqiService.getAQI();
    }
}