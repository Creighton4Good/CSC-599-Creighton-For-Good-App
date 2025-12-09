package creighton4good.app.events;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CncurrentHashMap;
import java.util.concourrent.atomic.AtomicLong;
import java.util.stream.Collectors;

public class EventStore {
    private final Map<Long, Event> db = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(1);

    public EventStore()  {
        save(new Event(null, "Food Drive", "Community food drive", LocalDateTime.now().plusDays(3), LocalDateTime.now().plusDays(3).plusHours(2), "Skutt Student Center",
    Set.of("community", "donations")));
        save(new Event(null, "AI Mentorship Night", "Meet local AI Engineers",
            LocalDateTime.now().plusDays(7), LocalDateTime.now().plusDays(7).plusHours(2),
            "Harper Center 405", Set.of("AI", "mentorship")));
    }

    public List<Event> list(String q) {
        return db.values().stream().filter(e-> q==null || q.isBlank()
        || contains(e.getTitle(), q) || contains(e.getDescription(), q).sorted(Comparator.comparing(Event::getStartsAt, 
        Comparator.naturalOrder())).reversed().collect(Collectors.toList()));
        
    }

    public Event get(Long id){ return db.get(id); }

    public Event save(Event e){
        if(e.getId() == null) e.setId(seq.getAndIncrement());
        db.put(e.getId(), e);
        return e;
    }

    public void delete(Long id){ db.remove(id); }

    private boolean contains(String s, String q){
        return s != null && s.toLowerCase().contains(q.toLowerCase());
    }


    
    
}