package com.cleanroute.controller;

import com.cleanroute.entity.AQIHistory;
import com.cleanroute.service.AQIHistoryService;
import org.springframework.web.bind.annotation.*;
import com.cleanroute.dto.CleanTravelWindowResponse;
import java.util.List;

@RestController
@RequestMapping("/api/aqi-history")
public class AQIHistoryController {

    private final AQIHistoryService service;

    public AQIHistoryController(AQIHistoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<AQIHistory> getHistory() {
        return service.getAllHistory();
    }
    @GetMapping("/best-time")
    public AQIHistory getBestTime() {
        return service.getBestTravelWindow();
    }
    @GetMapping("/clean-travel-window")
    public CleanTravelWindowResponse
    getCleanTravelWindow() {

        return service.getCleanTravelWindow();
    }
}