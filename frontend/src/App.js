import React, { useState, useEffect } from "react";
import { MapPin, Clock, Users, X, Plus } from "lucide-react";
import "./App.css";

// ---------------------------------------------
// EventCard Component
// ---------------------------------------------
const EventCard = ({ event, onViewDetails, onMarkCompleted, onDelete }) => {
  const isActive = event.status === "Active";

  return (
    <div className={`event-card${!isActive ? " inactive" : ""}`}>
      <div className="event-card-header">
        <h3 className={`event-card-title${!isActive ? " inactive" : ""}`}>
          {event.title}
        </h3>
        <div className="event-card-header-actions">
          <div className={`event-card-status${!isActive ? " inactive" : ""}`}>
            {event.status}
          </div>
          <button className="delete-button" onClick={() => onDelete(event.id)}>
            Delete
          </button>
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
        <div className="event-card-actions">
          <button
            className="event-card-button"
            onClick={() => onViewDetails(event.id)}
          >
            View Details & Claim
          </button>
          <button
            className="event-card-button complete-button"
            onClick={() => onMarkCompleted(event.id)}
          >
            Mark Completed
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------
// CreateEventModal Component
// ---------------------------------------------
const CreateEventModal = ({ onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startsAt: "",
    endsAt: "",
    meals: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.startsAt ||
      !formData.endsAt ||
      !formData.meals
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const eventData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      startsAt: formData.startsAt,
      endsAt: formData.endsAt,
      meals: parseInt(formData.meals) || 0,
      tags: tagsArray,
      status: "Active",
    };

    onCreateEvent(eventData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="modal-title">Create New Event</h2>

        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-input form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Start Date & Time *</label>
            <input
              type="datetime-local"
              name="startsAt"
              value={formData.startsAt}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date & Time *</label>
            <input
              type="datetime-local"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Meals *</label>
            <input
              type="number"
              name="meals"
              value={formData.meals}
              onChange={handleChange}
              min="0"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. community, food, volunteering"
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button onClick={handleSubmit} className="button-primary">
              Create Event
            </button>
            <button onClick={onClose} className="button-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
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
// SignInPage Component (NEW)
// ---------------------------------------------
const SignInPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy authentication logic: any non-empty fields will "succeed"
    if (username && password) {
      onLogin(); // Call the login function passed from the parent App
    } else {
      alert("Please enter a username and password.");
    }
  };

  return (
    <div className="signin-page-container">
      <div className="signin-box">
        <h2 className="signin-title">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username/Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="button-primary signin-btn">
            Log In
          </button>
        </form>
        <div className="signin-footer">
          {/* FIX 1/3: Changed href="#" to href="#!" to fix jsx-a11y/anchor-is-valid warning */}
          <a href="#!" onClick={() => alert("Forgot Password not implemented.")}>
            Forgot Password?
          </a>
          {/* FIX 2/3: Changed href="#" to href="#!" to fix jsx-a11y/anchor-is-valid warning */}
          <a href="#!" onClick={() => alert("Sign Up not implemented.")}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------
// Main App Component (MODIFIED)
// ---------------------------------------------
const App = () => {
  const [activeTab, setActiveTab] = useState("Active Events");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // NEW: Login handler (FIX 3/3: Now used in the return statement)
  const handleLogin = () => {
    // In a real app, you would handle token storage here
    setIsLoggedIn(true);
  };

  // NEW: Logout handler (FIX 4/3: Now used in the renderContent 'Profile' case)
  const handleLogout = () => {
    // In a real app, you would clear token/session here
    setIsLoggedIn(false);
    setActiveTab("Active Events"); // Reset view on logout
  };

  // Fetch all events from the backend
  const fetchEvents = async () => {
    // Only fetch if logged in
    if (!isLoggedIn) return;

    try {
      const response = await fetch("http://localhost:8080/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    // Only attempt to fetch events if the user is logged in
    // This consolidated useEffect handles initial fetch and re-fetch on login status change.
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]); // Re-run effect when login status changes
  
  // REMOVED: Redundant useEffect with empty dependency array which caused warnings.

  // Fetch a single event by ID
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

  // Mark event as completed
  const handleMarkCompleted = async (id) => {
    try {
      const event = events.find((e) => e.id === id);
      if (!event) return;

      const updatedEvent = { ...event, status: "Completed", meals: 0 };

      const response = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error("Failed to update event");

      // Refresh events list
      await fetchEvents();
    } catch (error) {
      console.error("Error marking event as completed:", error);
    }
  };

  // Create new event
  const handleCreateEvent = async (eventData) => {
    try {
      const response = await fetch("http://localhost:8080/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      // Refresh events list and close modal
      await fetchEvents();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Delete event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");

      // Refresh events list
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleViewDetails = (id) => {
    fetchEventById(id);
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
            <div className="content-header">
              <h2 className="content-title">{activeTab}</h2>
              {activeTab === "Active Events" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="create-event-button"
                >
                  <Plus size={20} />
                  Create Event
                </button>
              )}
            </div>

            <div className="events-grid">
              {filteredEvents.length === 0 ? (
                <p className="no-events-message">No events found.</p>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={handleViewDetails}
                    onMarkCompleted={handleMarkCompleted}
                    onDelete={handleDeleteEvent}
                  />
                ))
              )}
            </div>

            {selectedEvent && (
              <div className="modal-overlay">
                <div className="event-details-modal">
                  <h3 className="event-details-title">{selectedEvent.title}</h3>
                  <p className="event-details-description">
                    {selectedEvent.description}
                  </p>
                  <p className="event-details-info">
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                  <p className="event-details-info">
                    <strong>Time:</strong> {selectedEvent.time}
                  </p>
                  <p className="event-details-info">
                    <strong>Meals:</strong> {selectedEvent.meals}
                  </p>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="button-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case "Profile":
        return (
          <div className="content-container">
            <h2 className="content-title">User Profile</h2>
            <p className="profile-message">
              This is where your user profile information would go.
            </p>
            {/* NEW: Logout Button (Fixes 'handleLogout' unused warning) */}
            <button
              onClick={handleLogout}
              className="button-secondary logout-btn"
            >
              Log Out
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  // Conditional rendering based on authentication state
  return (
    <div className="app">
      {isLoggedIn ? (
        <>
          <HeaderWithTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="app-main-content">{renderContent()}</main>

          {showCreateModal && (
            <CreateEventModal
              onClose={() => setShowCreateModal(false)}
              onCreateEvent={handleCreateEvent}
            />
          )}
        </>
      ) : (
        // Show the Sign In Page if not logged in (Fixes 'SignInPage' unused warning)
        <SignInPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;