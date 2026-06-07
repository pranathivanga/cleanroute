package com.cleanroute.controller;

import com.cleanroute.dto.RouteRecommendation;
import com.cleanroute.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendation")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {

        this.recommendationService = recommendationService;
    }

    @GetMapping
    public RouteRecommendation getRecommendation(

            @RequestParam int aqi,
            @RequestParam double pollutionScore) {

        return recommendationService.getRecommendation(
                aqi,
                pollutionScore);
    }
}