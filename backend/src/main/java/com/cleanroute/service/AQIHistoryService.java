package com.cleanroute.service;

import com.cleanroute.entity.AQIHistory;
import com.cleanroute.repository.AQIHistoryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AQIHistoryService {

    private final AQIHistoryRepository repository;
    private final AQIService aqiService;

    public AQIHistoryService(
            AQIHistoryRepository repository,
            AQIService aqiService) {

        this.repository = repository;
        this.aqiService = aqiService;
    }

    @Scheduled(fixedRate = 60000)
    public void collectAQI() {

        int aqi =
                aqiService.getAQI(
                        17.3850,
                        78.4867);

        AQIHistory record =
                new AQIHistory(
                        aqi,
                        LocalDateTime.now());

        repository.save(record);

        System.out.println(
                "AQI Saved: " + aqi);
    }
}