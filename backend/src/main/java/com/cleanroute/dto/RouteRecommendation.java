package com.cleanroute.dto;

public class RouteRecommendation {

    private int aqi;
    private double pollutionScore;
    private String recommendation;

    public RouteRecommendation(
            int aqi,
            double pollutionScore,
            String recommendation) {

        this.aqi = aqi;
        this.pollutionScore = pollutionScore;
        this.recommendation = recommendation;
    }

    public int getAqi() {
        return aqi;
    }

    public double getPollutionScore() {
        return pollutionScore;
    }

    public String getRecommendation() {
        return recommendation;
    }
}