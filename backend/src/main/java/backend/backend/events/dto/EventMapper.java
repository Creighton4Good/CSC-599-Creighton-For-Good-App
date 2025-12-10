package backend.backend.events.dto;

import backend.backend.entities.Event;
import backend.backend.entities.Location;
import backend.backend.entities.Organization;
import backend.backend.entities.User;

public final class EventMapper {

    private EventMapper() {
    }

    public static EventResponse toResponse(Event event) {
        if (event == null) {
            return null;
        }

        Organization organization = event.getOrganization();
        Location location = event.getLocation();
        User creator = event.getCreatedBy();

        String locationDetails = location != null ? location.getFullLocation() : null;
        String locationName = location != null ? location.getName() : null;
        Long locationId = location != null ? location.getLocationId() : null;

        String orgName = organization != null ? organization.getName() : null;
        Long orgId = organization != null ? organization.getOrgId() : null;

        Long creatorId = creator != null ? creator.getUserId() : null;
        String creatorName = creator != null ? creator.getDisplayName() : null;

        String status = event.getStatus() != null ? event.getStatus().name() : null;

        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                status,
                formatStatusLabel(status),
                event.getStartsAt(),
                event.getEndsAt(),
                event.getTime(),
                event.getMeals(),
                orgId,
                orgName,
                locationId,
                locationName,
                locationDetails,
                creatorId,
                creatorName);
    }

    private static String formatStatusLabel(String status) {
        if (status == null || status.isBlank()) {
            return "";
        }
        String lower = status.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
