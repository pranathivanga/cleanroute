package com.cleanroute.repository;

import com.cleanroute.entity.AQIHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AQIHistoryRepository
        extends JpaRepository<AQIHistory, Long> {

    List<AQIHistory> findAllByOrderByAqiAsc();

    List<AQIHistory> findAllByOrderByRecordedAtDesc();
}