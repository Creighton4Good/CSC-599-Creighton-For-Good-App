package backend.backend.events.dto;

import java.time.LocalDateTime;

public record EventRequest(
        String title,
        String description,
        Long organizationId,
        Long locationId,
        String locationName,
        Long createdById,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        Integer meals,
        String status) {
}
