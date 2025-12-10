package backend.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "org_id")
    private Long orgId;
    
    @Column(nullable = false, unique = true, length = 150)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrgType type = OrgType.DINING;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum OrgType {
        DINING, DEPARTMENT, CLUB, EXTERNAL
    }
    
    // Constructors
    public Organization() {
    }
    
    public Organization(String name, OrgType type) {
        this.name = name;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getOrgId() {
        return orgId;
    }
    
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public OrgType getType() {
        return type;
    }
    
    public void setType(OrgType type) {
        this.type = type;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
