package com.cleanroute.controller;

import com.cleanroute.entity.SavedRoute;
import com.cleanroute.service.SavedRouteService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-routes")
public class SavedRouteController {

    private final SavedRouteService service;

    public SavedRouteController(SavedRouteService service) {
        this.service = service;
    }

    @PostMapping
    public SavedRoute saveRoute(
            @RequestBody SavedRoute route) {

        return service.saveRoute(route);
    }
}