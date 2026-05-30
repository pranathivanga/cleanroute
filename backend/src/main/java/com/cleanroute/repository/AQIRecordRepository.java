package com.cleanroute.repository;

import com.cleanroute.entity.AQIRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AQIRecordRepository extends JpaRepository<AQIRecord, Long> {
}