package com.cleanroute.dto;

public class CleanTravelWindowResponse {

    private String routeName;
    private int aqi;
    private double temperature;
    private int humidity;
    private double windSpeed;
    private String recommendation;

    public CleanTravelWindowResponse(
            String routeName,
            int aqi,
            double temperature,
            int humidity,
            double windSpeed,
            String recommendation) {

        this.routeName = routeName;
        this.aqi = aqi;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.recommendation = recommendation;
    }

    public String getRouteName() {
        return routeName;
    }

    public int getAqi() {
        return aqi;
    }

    public double getTemperature() {
        return temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public String getRecommendation() {
        return recommendation;
    }
}