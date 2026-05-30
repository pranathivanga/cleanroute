package com.cleanroute.dto;

public class RouteOption {

    private String routeName;
    private double distanceKm;
    private double durationMinutes;

    public RouteOption(
            String routeName,
            double distanceKm,
            double durationMinutes) {

        this.routeName = routeName;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
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
}