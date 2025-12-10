package backend.backend.events;

import backend.backend.entities.Event;
import backend.backend.repositories.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> list(String q) {
        if (q == null || q.isBlank()) {
            return eventRepository.findAll();
        }
        return eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
    }

    public Event get(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public Event create(Event e) {
        return eventRepository.save(e);
    }

    public Event update(Long id, Event e) {
        e.setId(id);
        return eventRepository.save(e);
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

}
