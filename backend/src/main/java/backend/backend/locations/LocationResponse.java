package backend.backend.locations;

import backend.backend.entities.Location;
import backend.backend.entities.Organization;

public record LocationResponse(
        Long id,
        Long organizationId,
        String organizationName,
        String name,
        String building,
        String room,
        String displayName) {

    public static LocationResponse fromEntity(Location location) {
        Organization organization = location.getOrganization();
        return new LocationResponse(
                location.getLocationId(),
                organization != null ? organization.getOrgId() : null,
                organization != null ? organization.getName() : null,
                location.getName(),
                location.getBuilding(),
                location.getRoom(),
                location.getFullLocation());
    }
}
