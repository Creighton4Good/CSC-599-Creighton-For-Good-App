package com.creighton4good.app.events;

import java.time.LocalDateTime;
import java.util.Set;

public class Event {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startsAt;
    private LocalDateTime endsAt;
    private String location;
    private Set<String> tags;

    public Event() {}
        public Event(Long id, String title, String description, 
                    LocalDateTime startsAt, LocalDateTime endsAt,
                    String location, Set<String> tags) {
            this.id = id; this.title = title; this.description = description;
            this.startsAt = startsAt; this.endsAt = endsAt;
            this.location = location; this.tags = tags;
            }

            // getters & setters methods
            public Long getId(){ return id; }
            public void setId(Long id){ this.id = id; }
            public String getTitle(){ return title; }
            public void setTitle(String title){ this.title = title; }
            public String getDescription(){ return description; }
            public void setDescription(String description){ this. description = description; }
            public LocalDateTime getStartsAt(){ return startsAt; }
            public void setStartsAt(LocalDateTime startsAt){ this.startsAt = startsAt; }
            public LocalDateTime getEndsAt(){return endsAt; }
            public void setEndsAt(LocalDateTime endsAt){ this.endsAt = endsAt; }
            public String getLocation(){ return location; }
            public void setLocation(String location){ this. location = location;}
            public Set<String> getTags(){ return tags; }
            public void setTags(Set<String> tags){ this.tags = tags; }
}