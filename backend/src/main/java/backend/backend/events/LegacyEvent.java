package backend.backend.events;

import backend.backend.entities.Event;

// This class is deprecated - using backend.backend.entities.Event instead
// Kept for backwards compatibility during transition
@Deprecated
public class LegacyEvent extends Event {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private String location;
    private Set<String> tags;
    private String status;
    private Integer meals;

    public Event() {
    }

    public Event(Long id, String title, String description,
            LocalDateTime startsAt, LocalDateTime endsAt,
            String location, Set<String> tags, String status, Integer meals) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.location = location;
        this.tags = tags;
        this.status = status;
        this.meals = meals;
    }

    // Getters & setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDateTime startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDateTime getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDateTime endsAt) {
        this.endsAt = endsAt;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMeals() {
        return meals;
    }

    public void setMeals(Integer meals) {
        this.meals = meals;
    }

    // Computed property for frontend
    public String getTime() {
        if (startsAt == null)
            return "";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy h:mm a");
        return startsAt.format(formatter);
    }
}