package com.cleanroute.service;

import com.cleanroute.entity.SavedRoute;
import com.cleanroute.repository.SavedRouteRepository;
import org.springframework.stereotype.Service;

@Service
public class SavedRouteService {

    private final SavedRouteRepository repository;

    public SavedRouteService(SavedRouteRepository repository) {
        this.repository = repository;
    }

    public SavedRoute saveRoute(SavedRoute route) {
        return repository.save(route);
    }
}