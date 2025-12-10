package backend.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "event_items")
public class EventItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_item_id")
    private Long eventItemId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(nullable = false, length = 140)
    private String name;
    
    @Column(name = "portions_available", nullable = false)
    private Integer portionsAvailable;
    
    @Column(name = "portions_claimed", nullable = false)
    private Integer portionsClaimed = 0;
    
    @Column(name = "per_user_limit", nullable = false)
    private Integer perUserLimit = 0;
    
    // Constructors
    public EventItem() {
    }
    
    public EventItem(Event event, String name, Integer portionsAvailable) {
        this.event = event;
        this.name = name;
        this.portionsAvailable = portionsAvailable;
    }
    
    // Getters and Setters
    public Long getEventItemId() {
        return eventItemId;
    }
    
    public void setEventItemId(Long eventItemId) {
        this.eventItemId = eventItemId;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getPortionsAvailable() {
        return portionsAvailable;
    }
    
    public void setPortionsAvailable(Integer portionsAvailable) {
        this.portionsAvailable = portionsAvailable;
    }
    
    public Integer getPortionsClaimed() {
        return portionsClaimed;
    }
    
    public void setPortionsClaimed(Integer portionsClaimed) {
        this.portionsClaimed = portionsClaimed;
    }
    
    public Integer getPerUserLimit() {
        return perUserLimit;
    }
    
    public void setPerUserLimit(Integer perUserLimit) {
        this.perUserLimit = perUserLimit;
    }
    
    // Helper methods
    public Integer getPortionsRemaining() {
        return portionsAvailable - portionsClaimed;
    }
    
    public boolean isAvailable() {
        return getPortionsRemaining() > 0;
    }
}
