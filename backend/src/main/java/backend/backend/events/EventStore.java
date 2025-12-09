package backend.backend.events;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Component
public class EventStore {
    private final Map<Long, Event> db = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(1);

    public EventStore() {
        // Create sample events with status and meals
        Event event1 = new Event(
                null,
                "Food Drive",
                "Community food drive",
                LocalDateTime.now().plusDays(3),
                LocalDateTime.now().plusDays(3).plusHours(2),
                "Skutt Student Center",
                Set.of("community", "donations"),
                "Active",
                150);
        save(event1);

        Event event2 = new Event(
                null,
                "AI Mentorship Night",
                "Meet local AI Engineers",
                LocalDateTime.now().plusDays(7),
                LocalDateTime.now().plusDays(7).plusHours(2),
                "Harper Center 405",
                Set.of("AI", "mentorship"),
                "Active",
                75);
        save(event2);

        Event event3 = new Event(
                null,
                "Campus Cleanup",
                "Help clean up campus grounds",
                LocalDateTime.now().minusDays(2),
                LocalDateTime.now().minusDays(2).plusHours(3),
                "Campus Quad",
                Set.of("community", "environment"),
                "Completed",
                0);
        save(event3);
    }

    public List<Event> list(String q) {
        return db.values().stream()
                .filter(e -> q == null || q.isBlank()
                        || contains(e.getTitle(), q)
                        || contains(e.getDescription(), q))
                .sorted(Comparator.comparing(Event::getStartsAt).reversed())
                .collect(Collectors.toList());
    }

    public Event get(Long id) {
        return db.get(id);
    }

    public Event save(Event e) {
        if (e.getId() == null)
            e.setId(seq.getAndIncrement());
        db.put(e.getId(), e);
        return e;
    }

    public void delete(Long id) {
        db.remove(id);
    }

    private boolean contains(String s, String q) {
        return s != null && s.toLowerCase().contains(q.toLowerCase());
    }
}