package backend.backend.locations;

import backend.backend.repositories.LocationRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/locations")
@CrossOrigin(origins = "http://localhost:3000")
public class LocationController {

    private final LocationRepository locationRepository;

    public LocationController(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @GetMapping
    public List<LocationResponse> list() {
        return locationRepository.findAll().stream()
                .map(LocationResponse::fromEntity)
                .toList();
    }
}
