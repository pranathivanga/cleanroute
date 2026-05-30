package com.cleanroute.repository;

import com.cleanroute.entity.AQIHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AQIHistoryRepository
        extends JpaRepository<AQIHistory, Long> {
}