package com.cleanroute.dto;

public class RouteOption {

    private String routeName;
    private double distanceKm;
    private double durationMinutes;
    private int aqi;
    private double pollutionScore;

    public RouteOption(
            String routeName,
            double distanceKm,
            double durationMinutes,
            int aqi,
            double pollutionScore) {

        this.routeName = routeName;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.aqi = aqi;
        this.pollutionScore = pollutionScore;
    }

    public String getRouteName() {
        return routeName;
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
}