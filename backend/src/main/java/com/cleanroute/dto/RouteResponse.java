package com.cleanroute.dto;

public class RouteResponse {

    private double distanceKm;
    private double durationMinutes;
    private int aqi;
    private double pollutionScore;
    private String healthRating;

    public RouteResponse(
            double distanceKm,
            double durationMinutes,
            int aqi,
            double pollutionScore,
            String healthRating) {

        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.aqi = aqi;
        this.pollutionScore = pollutionScore;
        this.healthRating = healthRating;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public double getDurationMinutes() {
        return durationMinutes;
    }

    public int getAqi() {
        return aqi;
    }

    public double getPollutionScore() {
        return pollutionScore;
    }

    public String getHealthRating() {
        return healthRating;
    }
}