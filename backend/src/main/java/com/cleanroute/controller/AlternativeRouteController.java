package com.cleanroute.controller;

import com.cleanroute.dto.RouteOption;
import com.cleanroute.service.AlternativeRouteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes/alternatives")
public class AlternativeRouteController {

    private final AlternativeRouteService alternativeRouteService;

    public AlternativeRouteController(
            AlternativeRouteService alternativeRouteService) {

        this.alternativeRouteService =
                alternativeRouteService;
    }

    @GetMapping
    public List<RouteOption> getRoutes(

            @RequestParam double startLon,
            @RequestParam double startLat,
            @RequestParam double endLon,
            @RequestParam double endLat) {

        return alternativeRouteService
                .getAlternativeRoutes(
                        startLon,
                        startLat,
                        endLon,
                        endLat);
    }
}