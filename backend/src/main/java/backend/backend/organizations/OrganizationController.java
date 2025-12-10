package backend.backend.organizations;

import backend.backend.repositories.OrganizationRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/organizations")
@CrossOrigin(origins = "http://localhost:3000")
public class OrganizationController {

    private final OrganizationRepository organizationRepository;

    public OrganizationController(OrganizationRepository organizationRepository) {
        this.organizationRepository = organizationRepository;
    }

    @GetMapping
    public List<OrganizationResponse> list() {
        return organizationRepository.findAll().stream()
                .map(OrganizationResponse::fromEntity)
                .toList();
    }
}
