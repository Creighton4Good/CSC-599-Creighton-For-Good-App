package backend.backend.events;

import backend.backend.entities.Event;
import backend.backend.entities.Event.EventStatus;
import backend.backend.entities.EventItem;
import backend.backend.entities.Location;
import backend.backend.entities.Organization;
import backend.backend.entities.User;
import backend.backend.events.dto.EventMapper;
import backend.backend.events.dto.EventRequest;
import backend.backend.events.dto.EventResponse;
import backend.backend.repositories.EventRepository;
import backend.backend.repositories.LocationRepository;
import backend.backend.repositories.OrganizationRepository;
import backend.backend.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Coordinates event CRUD operations while enforcing organization/location/user relationships.
 * This layer keeps the controllers slim and centralizes validation so the frontend only needs to send IDs.
 */
@Service
public class EventService {

    private final EventRepository eventRepository;
    private final OrganizationRepository organizationRepository;
    private final LocationRepository locationRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        OrganizationRepository organizationRepository,
                        LocationRepository locationRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.organizationRepository = organizationRepository;
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Returns matching events, eager-loading the relationships needed by the frontend cards.
     */
    @Transactional(readOnly = true)
    public List<EventResponse> list(String q) {
        List<Event> events = (q == null || q.isBlank())
                ? eventRepository.findAll()
                : eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);

        return events.stream()
                .map(EventMapper::toResponse)
                .toList();
    }

    /**
     * Fetches a single event with related data or null if it does not exist.
     */
    @Transactional(readOnly = true)
    public EventResponse get(Long id) {
        return eventRepository.findById(id)
                .map(EventMapper::toResponse)
                .orElse(null);
    }

    /**
     * Creates a new event after applying validation/mapping rules.
     */
    @Transactional
    public EventResponse create(EventRequest request) {
        Event event = new Event();
        apply(event, request);
        return EventMapper.toResponse(eventRepository.save(event));
    }

    /**
     * Updates an existing event, preserving referential integrity.
     */
    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Event %d not found".formatted(id)));
        apply(event, request);
        return EventMapper.toResponse(eventRepository.save(event));
    }

    /**
     * Removes an event by id.
     */
    @Transactional
    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    /**
     * Applies incoming data to the entity instance (new or existing).
     */
    private void apply(Event event, EventRequest request) {
        String title = Optional.ofNullable(request.title())
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElseThrow(() -> new IllegalArgumentException("Title is required"));
        event.setTitle(title);
        event.setDescription(request.description());

        if (request.startsAt() == null) {
            throw new IllegalArgumentException("Start time is required");
        }
        event.setStartTime(request.startsAt());
        event.setEndTime(request.endsAt());
        event.setStatus(parseStatus(request.status()));

        Organization organization = resolveOrganization(request.organizationId());
        Location location = resolveLocation(request.locationId(), request.locationName(), organization);
        event.setOrganization(organization);
        event.setLocation(location);

        User creator = resolveCreator(request.createdById());
        event.setCreatedBy(creator);

        syncMeals(event, request.meals());
    }

    private EventStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return EventStatus.DRAFT;
        }
        return switch (status.trim().toUpperCase()) {
            case "ACTIVE" -> EventStatus.ACTIVE;
            case "PUBLISHED" -> EventStatus.PUBLISHED;
            case "ENDED", "COMPLETED" -> EventStatus.ENDED;
            case "CANCELLED" -> EventStatus.CANCELLED;
            default -> EventStatus.DRAFT;
        };
    }

    private Organization resolveOrganization(Long organizationId) {
        if (organizationId == null) {
            throw new IllegalArgumentException("Organization is required");
        }
        return organizationRepository.findById(organizationId)
                .orElseThrow(() -> new EntityNotFoundException("Organization %d not found".formatted(organizationId)));
    }

    /**
     * Returns an organization-scoped location, creating one if only a name is provided.
     */
    private Location resolveLocation(Long locationId, String locationName, Organization organization) {
        if (locationId != null) {
            Location location = locationRepository.findById(locationId)
                    .orElseThrow(() -> new EntityNotFoundException("Location %d not found".formatted(locationId)));
            if (location.getOrganization() == null
                    || !location.getOrganization().getOrgId().equals(organization.getOrgId())) {
                throw new IllegalArgumentException("Location does not belong to the provided organization");
            }
            return location;
        }

        String sanitizedName = Optional.ofNullable(locationName)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .orElseThrow(() -> new IllegalArgumentException("Location name is required"));

        return locationRepository
                .findByOrganizationOrgIdAndNameIgnoreCase(organization.getOrgId(), sanitizedName)
                .orElseGet(() -> {
                    Location location = new Location(organization, sanitizedName);
                    return locationRepository.save(location);
                });
    }

    private User resolveCreator(Long createdById) {
        if (createdById != null) {
            return userRepository.findById(createdById)
                    .orElseThrow(() -> new EntityNotFoundException("User %d not found".formatted(createdById)));
        }
        return userRepository.findFirstByOrderByUserIdAsc()
                .orElseThrow(() -> new IllegalStateException("No users available"));
    }

    private void syncMeals(Event event, Integer meals) {
        if (meals == null) {
            return;
        }
        int sanitizedMeals = Math.max(0, meals);
        EventItem eventItem = event.getEventItems().isEmpty()
                ? null
                : event.getEventItems().get(0);
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
        if (eventItem.getPerUserLimit() == null) {
            eventItem.setPerUserLimit(0);
        }
        if (eventItem.getPortionsClaimed() > sanitizedMeals) {
            eventItem.setPortionsClaimed(sanitizedMeals);
        }
    }
}
