package com.cleanroute.service;

import com.cleanroute.entity.SavedRoute;
import com.cleanroute.repository.SavedRouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedRouteService {

    private final SavedRouteRepository repository;

    public SavedRouteService(SavedRouteRepository repository) {
        this.repository = repository;
    }

    public SavedRoute saveRoute(SavedRoute route) {
        return repository.save(route);
    }
    public List<SavedRoute> getAllRoutes() {
        return repository.findAll();
    }
    public void deleteRoute(Long id) {
        repository.deleteById(id);
    }
}