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

        RouteOption route1 =
                new RouteOption(
                        "Fastest Route",
                        7.6,
                        10.8,
                        4,
                        48.5);

        RouteOption route2 =
                new RouteOption(
                        "Cleaner Route",
                        8.1,
                        12.5,
                        2,
                        21.7);

        RouteOption route3 =
                new RouteOption(
                        "Balanced Route",
                        7.9,
                        11.6,
                        3,
                        32.4);

        return List.of(
                route1,
                route2,
                route3);
    }
}