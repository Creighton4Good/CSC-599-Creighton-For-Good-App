package backend.backend.repositories;

import backend.backend.entities.Event;
import backend.backend.entities.Event.EventStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Override
    @EntityGraph(attributePaths = {"organization", "location", "createdBy", "eventItems"})
    List<Event> findAll();

    @Override
    @EntityGraph(attributePaths = {"organization", "location", "createdBy", "eventItems"})
    Optional<Event> findById(Long id);

    @EntityGraph(attributePaths = {"organization", "location", "createdBy", "eventItems"})
    List<Event> findByStatus(EventStatus status);

    @EntityGraph(attributePaths = {"organization", "location", "createdBy", "eventItems"})
    List<Event> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
}
