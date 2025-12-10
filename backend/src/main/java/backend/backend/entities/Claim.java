package backend.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long claimId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_item_id")
    private EventItem eventItem;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.CLAIMED;
    
    @Column(name = "claimed_at", nullable = false, updatable = false)
    private LocalDateTime claimedAt = LocalDateTime.now();
    
    @Column(name = "redeemed_at")
    private LocalDateTime redeemedAt;
    
    public enum ClaimStatus {
        CLAIMED, REDEEMED, CANCELLED, EXPIRED
    }
    
    // Constructors
    public Claim() {
    }
    
    public Claim(Event event, User user, Integer quantity) {
        this.event = event;
        this.user = user;
        this.quantity = quantity;
    }
    
    // Getters and Setters
    public Long getClaimId() {
        return claimId;
    }
    
    public void setClaimId(Long claimId) {
        this.claimId = claimId;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public EventItem getEventItem() {
        return eventItem;
    }
    
    public void setEventItem(EventItem eventItem) {
        this.eventItem = eventItem;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public ClaimStatus getStatus() {
        return status;
    }
    
    public void setStatus(ClaimStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }
    
    public void setClaimedAt(LocalDateTime claimedAt) {
        this.claimedAt = claimedAt;
    }
    
    public LocalDateTime getRedeemedAt() {
        return redeemedAt;
    }
    
    public void setRedeemedAt(LocalDateTime redeemedAt) {
        this.redeemedAt = redeemedAt;
    }
    
    // Helper methods
    public void redeem() {
        this.status = ClaimStatus.REDEEMED;
        this.redeemedAt = LocalDateTime.now();
    }
    
    public void cancel() {
        this.status = ClaimStatus.CANCELLED;
    }
}
