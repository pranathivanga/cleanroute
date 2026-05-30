package com.cleanroute.service;

import org.springframework.stereotype.Service;

@Service
public class PollutionScoreService {

    public double calculateScore(
            int aqi,
            double durationMinutes) {

        return aqi * durationMinutes;
    }

    public String getHealthRating(
            double score) {

        if (score < 20) {
            return "GOOD";
        }

        if (score < 40) {
            return "FAIR";
        }

        if (score < 60) {
            return "MODERATE";
        }

        return "POOR";
    }
}