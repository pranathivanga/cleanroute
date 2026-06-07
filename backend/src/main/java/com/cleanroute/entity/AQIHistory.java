package com.cleanroute.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
@Table(name = "aqi_history")
public class AQIHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private SavedRoute route;

    private int aqi;
    private double temperature;

    private int humidity;

    private double windSpeed;
    private LocalDateTime recordedAt;

    public AQIHistory() {
    }

    public AQIHistory(
            int aqi,
            double temperature,
            int humidity,
            double windSpeed,
            LocalDateTime recordedAt) {

        this.aqi = aqi;
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.recordedAt = recordedAt;
    }

    public Long getId() {
        return id;
    }

    public int getAqi() {
        return aqi;
    }

    public void setAqi(int aqi) {
        this.aqi = aqi;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(
            LocalDateTime recordedAt) {

        this.recordedAt = recordedAt;
    }
    public SavedRoute getRoute() {
        return route;
    }

    public void setRoute(SavedRoute route) {
        this.route = route;
    }
    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }

    public double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(double windSpeed) {
        this.windSpeed = windSpeed;
    }
}