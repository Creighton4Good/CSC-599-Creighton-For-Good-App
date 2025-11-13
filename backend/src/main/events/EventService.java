package creighton4good.app.events;

import org.springframework.stereotype.Service;

import java.util.List;

public class EventService {
    private final EventStore store;
    public EventService(EventStore store){ this.store = store; }

    public List<Event> list(String q){ return store.list(q); }
    public Event get(Long id){ return store.get(id); }
    public Event create(Event e){ return store.save(e); }
    public Event update(Long id, Event e){
        e.setId(id);
        return store.save(e);
    }
    public void delete(Long id){ store.delete(id); }
    
}
