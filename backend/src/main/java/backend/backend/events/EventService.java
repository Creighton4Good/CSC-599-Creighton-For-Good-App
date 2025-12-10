package backend.backend.events;

import backend.backend.entities.Event;
import backend.backend.entities.Event.EventStatus;
import backend.backend.entities.EventItem;
import backend.backend.entities.Location;
import backend.backend.entities.Organization;
import backend.backend.entities.User;
import backend.backend.repositories.EventRepository;
import backend.backend.repositories.LocationRepository;
import backend.backend.repositories.OrganizationRepository;
import backend.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final EventRepository eventRepository;
    private final LocationRepository locationRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        LocationRepository locationRepository,
                        OrganizationRepository organizationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.locationRepository = locationRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EventDto> list(String q) {
        List<Event> events;
        if (q == null || q.isBlank()) {
            events = eventRepository.findAll();
        } else {
            events = eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
        }
        return events.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventDto get(Long id) {
        return eventRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Transactional
    public EventDto create(EventDto dto) {
        Event event = new Event();
        applyRequest(event, dto);
        Event saved = eventRepository.save(event);
        return toDto(saved);
    }

    @Transactional
    public EventDto update(Long id, EventDto dto) {
        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event %d not found".formatted(id)));
        applyRequest(existing, dto);
        Event saved = eventRepository.save(existing);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    private void applyRequest(Event event, EventDto dto) {
        validate(dto);

        event.setTitle(dto.getTitle().trim());
        event.setDescription(dto.getDescription());
        event.setStatus(parseStatus(dto.getStatus()));
        event.setStartTime(parseDate(dto.getStartsAt()));
        event.setEndTime(parseDate(dto.getEndsAt()));

        Location location = resolveLocation(dto.getLocation());
        event.setLocation(location);
        event.setOrganization(location.getOrganization());

        if (event.getCreatedBy() == null) {
            event.setCreatedBy(resolveDefaultUser());
        }

        syncMeals(event, Optional.ofNullable(dto.getMeals()).orElse(0));
    }

    private void validate(EventDto dto) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (dto.getLocation() == null || dto.getLocation().isBlank()) {
            throw new IllegalArgumentException("Location is required");
        }
        if (dto.getStartsAt() == null || dto.getStartsAt().isBlank()) {
            throw new IllegalArgumentException("Start time is required");
        }
    }

    private void syncMeals(Event event, Integer meals) {
        int sanitizedMeals = Math.max(0, meals);
        EventItem eventItem = event.getEventItems().stream().findFirst().orElse(null);
        if (eventItem == null) {
            eventItem = new EventItem();
            eventItem.setEvent(event);
            eventItem.setName("General Portions");
            event.getEventItems().add(eventItem);
        }
        eventItem.setPortionsAvailable(sanitizedMeals);
        if (eventItem.getPortionsClaimed() == null) {
            eventItem.setPortionsClaimed(0);
        }
        if (eventItem.getPortionsClaimed() > sanitizedMeals) {
            eventItem.setPortionsClaimed(sanitizedMeals);
        }
    }

    private EventDto toDto(Event event) {
        EventDto dto = new EventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation() != null ? event.getLocation().getName() : null);
        dto.setStatus(toDisplayStatus(event.getStatus()));
        dto.setStartsAt(formatDate(event.getStartTime()));
        dto.setEndsAt(formatDate(event.getEndTime()));
        dto.setMeals(event.getMeals());
        dto.setTime(event.getTime());
        return dto;
    }

    private EventStatus parseStatus(String status) {
        if (status == null) {
            return EventStatus.DRAFT;
        }
        return switch (status.trim().toUpperCase()) {
            case "ACTIVE" -> EventStatus.ACTIVE;
            case "PUBLISHED" -> EventStatus.PUBLISHED;
            case "COMPLETED", "ENDED" -> EventStatus.ENDED;
            case "CANCELLED" -> EventStatus.CANCELLED;
            default -> EventStatus.DRAFT;
        };
    }

    private String toDisplayStatus(EventStatus status) {
        if (status == null) {
            return "Draft";
        }
        return switch (status) {
            case ACTIVE -> "Active";
            case PUBLISHED -> "Published";
            case ENDED -> "Completed";
            case CANCELLED -> "Cancelled";
            default -> "Draft";
        };
    }

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return LocalDateTime.parse(value.trim(), DATE_FORMATTER);
    }

    private String formatDate(LocalDateTime value) {
        if (value == null) {
            return null;
        }
        return value.format(DATE_FORMATTER);
    }

    private Location resolveLocation(String locationName) {
        String sanitized = locationName.trim();
        return locationRepository.findFirstByNameIgnoreCase(sanitized)
                .orElseGet(() -> createLocation(sanitized));
    }

    private Location createLocation(String locationName) {
        Organization org = organizationRepository.findFirstByOrderByOrgIdAsc()
                .orElseThrow(() -> new IllegalStateException("No organizations available"));
        Location location = new Location(org, locationName);
        return locationRepository.save(location);
    }

    private User resolveDefaultUser() {
        return userRepository.findFirstByOrderByUserIdAsc()
                .orElseThrow(() -> new IllegalStateException("No users available"));
    }
}
