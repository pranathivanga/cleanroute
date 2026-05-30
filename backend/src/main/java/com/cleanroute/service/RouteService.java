package com.cleanroute.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cleanroute.dto.RouteResponse;

@Service
public class RouteService {

    @Value("${ors.api.key}")
    private String apiKey;

    private final RestClient restClient = RestClient.create();

    public RouteResponse getRoute(
            double startLon,
            double startLat,
            double endLon,
            double endLat) {

        String url =
                "https://api.openrouteservice.org/v2/directions/driving-car?start="
                        + startLon + "," + startLat
                        + "&end="
                        + endLon + "," + endLat;

        String response = restClient.get()
                .uri(url)
                .header("Authorization", apiKey)
                .retrieve()
                .body(String.class);

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

            return new RouteResponse(
                    distanceKm,
                    durationMinutes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}