package com.cleanroute.repository;

import com.cleanroute.entity.SavedRoute;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedRouteRepository extends JpaRepository<SavedRoute, Long> {
}