package com.cleanroute.service;

import com.cleanroute.dto.RouteOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlternativeRouteService {

    @Value("${ors.api.key}")
    private String apiKey;

    @Value("${ors.base.url}")
    private String baseUrl;

    public List<RouteOption> getAlternativeRoutes(
            double startLon,
            double startLat,
            double endLon,
            double endLat) {

        System.out.println("Alternative route request received");

        return List.of();
    }
}