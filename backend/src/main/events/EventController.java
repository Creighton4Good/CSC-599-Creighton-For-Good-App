package creighton4good.app.events;

import org.springframework.http.HttpStatus;
import org.springframework.web.bin.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")

public class EventController {
    private final EventService service;
    public EventController(EventService service){ this.service = service; }

    @GetMapping
    public List<Event> list(@RequestParam(required=false) String q){
        return service.list(q);
    }

    @GetMapping("/{id}")
    public Event get(@PathVariable Long id) {
        Event e = service.get(id);
        if (e == null) throw new EventNotFound();
        return e;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event create(@RequestBody Event req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public Event update(@PathVariable Long id, @RequestBody Event req) {
        if (service.get(id) == null) throw new EventNotFound();
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.No_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    private static class EventNotFound extends RuntimeException{}
    
}
