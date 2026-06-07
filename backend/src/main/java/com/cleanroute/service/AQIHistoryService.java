package com.cleanroute.service;

import com.cleanroute.entity.AQIHistory;
import com.cleanroute.repository.AQIHistoryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.cleanroute.entity.SavedRoute;
import com.cleanroute.repository.SavedRouteRepository;
import java.util.List;
import java.time.LocalDateTime;
import com.cleanroute.dto.CleanTravelWindowResponse;

@Service
public class AQIHistoryService {
    private final SavedRouteRepository savedRouteRepository;
    private final AQIHistoryRepository repository;
    private final AQIService aqiService;
    private final WeatherService weatherService;

    public AQIHistoryService(
            AQIHistoryRepository repository,
            AQIService aqiService,
            SavedRouteRepository savedRouteRepository,
            WeatherService weatherService) {

        this.repository = repository;
        this.aqiService = aqiService;
        this.savedRouteRepository = savedRouteRepository;
        this.weatherService = weatherService;
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
            double temperature =
                    weatherService.getTemperature(
                            route.getStartLat(),
                            route.getStartLon());

            int humidity =
                    weatherService.getHumidity(
                            route.getStartLat(),
                            route.getStartLon());

            double windSpeed =
                    weatherService.getWindSpeed(
                            route.getStartLat(),
                            route.getStartLon());
            AQIHistory record =
                    new AQIHistory(
                            aqi,
                            temperature,
                            humidity,
                            windSpeed,
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
    public List<AQIHistory> getAllHistory() {
        return repository.findAll();
    }
    public AQIHistory getBestTravelWindow() {

        return repository
                .findAllByOrderByAqiAsc()
                .get(0);
    }
    public CleanTravelWindowResponse getCleanTravelWindow() {

        AQIHistory bestRecord =
                repository
                        .findAllByOrderByRecordedAtDesc()
                        .get(0);

        String recommendation;

        if (bestRecord.getAqi() <= 2) {
            recommendation = "GOOD_TO_TRAVEL";
        } else if (bestRecord.getAqi() == 3) {
            recommendation = "CAUTION";
        } else {
            recommendation = "AVOID_IF_POSSIBLE";
        }

        return new CleanTravelWindowResponse(
                bestRecord.getRoute().getRouteName(),
                bestRecord.getAqi(),
                bestRecord.getTemperature(),
                bestRecord.getHumidity(),
                bestRecord.getWindSpeed(),
                recommendation
        );
    }
}