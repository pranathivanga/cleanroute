package com.cleanroute.service;

import com.cleanroute.dto.RouteRecommendation;
import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    public RouteRecommendation getRecommendation(
            int aqi,
            double pollutionScore) {

        String recommendation;

        if (aqi <= 2) {
            recommendation = "GOOD_TO_TRAVEL";
        } else if (aqi == 3) {
            recommendation = "CAUTION";
        } else {
            recommendation = "AVOID_IF_POSSIBLE";
        }

        return new RouteRecommendation(
                aqi,
                pollutionScore,
                recommendation);
    }
}