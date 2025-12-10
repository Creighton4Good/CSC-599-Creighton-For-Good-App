package backend.backend.config;

import backend.backend.entities.*;
import backend.backend.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            LocationRepository locationRepository,
            EventRepository eventRepository) {
        return args -> {
            // Only initialize if database is empty
            if (eventRepository.count() > 0) {
                return;
            }
            
            // Create a default user
            User defaultUser = new User(
                "admin@creighton.edu",
                "System Admin",
                User.UserRole.ADMIN
            );
            userRepository.save(defaultUser);
            
            // Create organizations
            Organization diningOrg = new Organization("Creighton Dining", Organization.OrgType.DINING);
            organizationRepository.save(diningOrg);
            
            Organization clubOrg = new Organization("Student Activities", Organization.OrgType.CLUB);
            organizationRepository.save(clubOrg);
            
            // Create locations
            Location skutt = new Location(diningOrg, "Skutt Student Center");
            skutt.setBuilding("Skutt Student Center");
            locationRepository.save(skutt);
            
            Location harper = new Location(clubOrg, "Harper Center");
            harper.setBuilding("Harper Center");
            harper.setRoom("405");
            locationRepository.save(harper);
            
            Location quad = new Location(clubOrg, "Campus Quad");
            locationRepository.save(quad);
            
            // Create events
            Event event1 = new Event(
                diningOrg,
                skutt,
                defaultUser,
                "Food Drive",
                LocalDateTime.now().plusDays(3)
            );
            event1.setDescription("Community food drive");
            event1.setEndTime(LocalDateTime.now().plusDays(3).plusHours(2));
            event1.setStatus(Event.EventStatus.ACTIVE);
            eventRepository.save(event1);
            
            // Add event item for food drive
            EventItem foodItem = new EventItem(event1, "Food Portions", 150);
            event1.getEventItems().add(foodItem);
            eventRepository.save(event1);
            
            Event event2 = new Event(
                clubOrg,
                harper,
                defaultUser,
                "AI Mentorship Night",
                LocalDateTime.now().plusDays(7)
            );
            event2.setDescription("Meet local AI Engineers");
            event2.setEndTime(LocalDateTime.now().plusDays(7).plusHours(2));
            event2.setStatus(Event.EventStatus.ACTIVE);
            eventRepository.save(event2);
            
            // Add event item for mentorship
            EventItem mentorshipItem = new EventItem(event2, "Meal Portions", 75);
            event2.getEventItems().add(mentorshipItem);
            eventRepository.save(event2);
            
            Event event3 = new Event(
                clubOrg,
                quad,
                defaultUser,
                "Campus Cleanup",
                LocalDateTime.now().minusDays(2)
            );
            event3.setDescription("Help clean up campus grounds");
            event3.setEndTime(LocalDateTime.now().minusDays(2).plusHours(3));
            event3.setStatus(Event.EventStatus.ENDED);
            eventRepository.save(event3);
            
            System.out.println("✅ Sample data initialized successfully!");
        };
    }
}
