package com.cleanroute.service;

import com.cleanroute.entity.AQIHistory;
import com.cleanroute.repository.AQIHistoryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.cleanroute.entity.SavedRoute;
import com.cleanroute.repository.SavedRouteRepository;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class AQIHistoryService {
    private final SavedRouteRepository savedRouteRepository;
    private final AQIHistoryRepository repository;
    private final AQIService aqiService;

    public AQIHistoryService(
            AQIHistoryRepository repository,
            AQIService aqiService,
            SavedRouteRepository savedRouteRepository) {

        this.repository = repository;
        this.aqiService = aqiService;
        this.savedRouteRepository = savedRouteRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void collectAQI() {

        List<SavedRoute> routes =
                savedRouteRepository.findAll();
        System.out.println("Routes found: " + routes.size());
        for (SavedRoute route : routes) {

            int aqi =
                    aqiService.getAQI(
                            route.getStartLat(),
                            route.getStartLon());

            AQIHistory record =
                    new AQIHistory(
                            aqi,
                            LocalDateTime.now());

            record.setRoute(route);

            repository.save(record);

            System.out.println(
                    "Saved AQI "
                            + aqi
                            + " for route "
                            + route.getRouteName());
        }
    }
}