import React, { useState, useEffect } from "react";
import { MapPin, Clock, Users } from "lucide-react";
import "./App.css";

// ---------------------------------------------
// EventCard Component
// ---------------------------------------------
const EventCard = ({ event, onViewDetails }) => {
  const isActive = event.status === "Active";

  return (
    <div className={`event-card${!isActive ? " inactive" : ""}`}>
      <div className="event-card-header">
        <h3 className={`event-card-title${!isActive ? " inactive" : ""}`}>
          {event.title}
        </h3>
        <div className={`event-card-status${!isActive ? " inactive" : ""}`}>
          {event.status}
        </div>
      </div>

      <div className="event-card-details">
        <p className="event-card-detail">
          <MapPin className="event-card-detail-icon" />
          <span className="event-card-detail-text">{event.location}</span>
        </p>
        <p className="event-card-detail">
          <Clock className="event-card-detail-icon" />
          <span className="event-card-detail-text">{event.time}</span>
        </p>
        <p className="event-card-detail">
          <Users className="event-card-detail-icon" />
          <span className="event-card-detail-text">
            Est. Meals Available: {event.meals}
          </span>
        </p>
      </div>

      {isActive && (
        <button
          className="event-card-button"
          onClick={() => onViewDetails(event.id)}
        >
          View Details & Claim
        </button>
      )}
    </div>
  );
};

// ---------------------------------------------
// HeaderWithTabs Component
// ---------------------------------------------
const HeaderWithTabs = ({ activeTab, onTabChange }) => {
  const tabs = ["Active Events", "Completed", "Profile"];

  return (
    <header className="app-header">
      <h1 className="app-title">Event Dashboard</h1>
      <nav className="tab-navigation">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
};

// ---------------------------------------------
// Main App Component
// ---------------------------------------------
const App = () => {
  const [activeTab, setActiveTab] = useState("Active Events");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // For event details

  // Fetch all events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events"); // Adjust port if needed
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []); // Only run once on mount

  // Fetch a single event by ID (for "View Details & Claim" button)
  const fetchEventById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/${id}`);
      if (!response.ok) throw new Error("Event not found");
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle clicking "View Details & Claim"
  const handleViewDetails = (id) => {
    fetchEventById(id);
    // Could open a modal or navigate to a details page
  };

  // Filter events based on the active tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === "Active Events") return event.status === "Active";
    if (activeTab === "Completed") return event.status === "Completed";
    return true;
  });

  // Render the content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Active Events":
      case "Completed":
        return (
          <div className="content-container">
            <h2>{activeTab}</h2>
            {filteredEvents.length === 0 ? (
              <p>No events found.</p>
            ) : (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                />
              ))
            )}
            {selectedEvent && (
              <div className="event-details-modal">
                <h3>{selectedEvent.title}</h3>
                <p>{selectedEvent.description}</p>
                <p>Location: {selectedEvent.location}</p>
                <p>Time: {selectedEvent.time}</p>
                <button onClick={() => setSelectedEvent(null)}>Close</button>
              </div>
            )}
          </div>
        );
      case "Profile":
        return (
          <div className="content-container">
            <h2>User Profile</h2>
            <p>This is where your user profile information would go.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <HeaderWithTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main-content">{renderContent()}</main>
    </div>
  );
};

export default App;
