package com.cleanroute.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "aqi_records")
@Getter
@Setter@NoArgsConstructor
@AllArgsConstructor
public class AQIRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;

    private Integer aqi;

    private LocalDateTime timestamp;
}