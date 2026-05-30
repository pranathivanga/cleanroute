package com.cleanroute.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "aqi_history")
public class AQIHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int aqi;

    private LocalDateTime recordedAt;

    public AQIHistory() {
    }

    public AQIHistory(
            int aqi,
            LocalDateTime recordedAt) {

        this.aqi = aqi;
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
}