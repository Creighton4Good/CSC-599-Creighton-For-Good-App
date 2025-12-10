package backend.backend.events.dto;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String title,
        String description,
        String status,
        String statusLabel,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        String time,
        Integer meals,
        Long organizationId,
        String organizationName,
        Long locationId,
        String locationName,
        String locationDetails,
        Long createdById,
        String createdByName) {
}
