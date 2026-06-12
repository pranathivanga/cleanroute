package com.cleanroute.service;

import com.cleanroute.dto.RouteResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RouteService {

    @Value("${ors.api.key}")
    private String apiKey;
    private final AQIService aqiService;
    private final RestClient restClient = RestClient.create();

    private final PollutionScoreService pollutionScoreService;

    public RouteService(
            PollutionScoreService pollutionScoreService,
            AQIService aqiService) {

        this.pollutionScoreService =
                pollutionScoreService;

        this.aqiService =
                aqiService;
    }

    public RouteResponse getRoute(
            double startLon,
            double startLat,
            double endLon,
            double endLat,
            String profile) {

        if (profile == null || profile.isBlank()) {
            profile = "driving-car";
        }

        String url =
                "https://api.openrouteservice.org/v2/directions/"
                        + profile
                        + "?start="
                        + startLon + "," + startLat
                        + "&end="
                        + endLon + "," + endLat;

        String response = restClient.get()
                .uri(url)
                .header("Authorization", apiKey)
                .retrieve()
                .body(String.class);
        System.out.println(response);
        try {

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root = mapper.readTree(response);

            JsonNode summary =
                    root.path("features")
                            .get(0)
                            .path("properties")
                            .path("summary");

            double distanceMeters =
                    summary.path("distance").asDouble();

            double durationSeconds =
                    summary.path("duration").asDouble();

            double distanceKm =
                    distanceMeters / 1000.0;

            double durationMinutes =
                    durationSeconds / 60.0;

            int aqi =
                    aqiService.getAQI(
                            startLat,
                            startLon);

            double pollutionScore =
                    pollutionScoreService.calculateScore(
                            aqi,
                            durationMinutes);

            String healthRating =
                    pollutionScoreService.getHealthRating(
                            pollutionScore);

            return new RouteResponse(
                    distanceKm,
                    durationMinutes,
                    aqi,
                    pollutionScore,
                    healthRating);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}