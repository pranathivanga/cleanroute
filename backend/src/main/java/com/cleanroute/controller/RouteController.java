package com.cleanroute.controller;

import com.cleanroute.service.RouteService;
import org.springframework.web.bind.annotation.*;
import com.cleanroute.dto.RouteResponse;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping
    public RouteResponse getRoute(

            @RequestParam("startLon") double startLon,
            @RequestParam("startLat") double startLat,
            @RequestParam("endLon") double endLon,
            @RequestParam("endLat") double endLat,
            @RequestParam(defaultValue = "driving-car")
            String profile) {

        return routeService.getRoute(
                startLon,
                startLat,
                endLon,
                endLat,
                profile);
    }
}