import React, { useEffect, useState } from "react";
import { MapPin, Clock, Users, X, Plus } from "lucide-react";
import "./App.css";

const API_BASE = "http://localhost:8080/api";

const EventCard = ({
  event,
  canManage,
  onViewDetails,
  onMarkCompleted,
  onDelete,
}) => {
  const isActive = event.status === "ACTIVE";
  const locationDisplay = event.locationDetails || event.locationName || "TBD";

  return (
    <div className={`event-card${!isActive ? " inactive" : ""}`}>
      <div className="event-card-header">
        <h3 className={`event-card-title${!isActive ? " inactive" : ""}`}>
          {event.title}
        </h3>
        <div className="event-card-header-actions">
          <div className={`event-card-status${!isActive ? " inactive" : ""}`}>
            {event.statusLabel}
          </div>
          <button className="delete-button" onClick={() => onDelete(event.id)}>
            Delete
          </button>
        </div>
      </div>

      <div className="event-card-details">
        <p className="event-card-detail">
          <MapPin className="event-card-detail-icon" />
          <span className="event-card-detail-text">{locationDisplay}</span>
        </p>
        <p className="event-card-detail">
          <Clock className="event-card-detail-icon" />
          <span className="event-card-detail-text">
            {event.time || "Schedule TBA"}
          </span>
        </p>
        <p className="event-card-detail">
          <Users className="event-card-detail-icon" />
          <span className="event-card-detail-text">
            Est. Meals Available: {event.meals ?? 0}
          </span>
        </p>
      </div>

      {isActive && canManage && (
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

const CreateEventModal = ({ onClose, onCreateEvent, organizations }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizationId: organizations.length ? String(organizations[0].id) : "",
    locationName: "",
    startsAt: "",
    endsAt: "",
    meals: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!formData.organizationId && organizations.length) {
      setFormData((prev) => ({
        ...prev,
        organizationId: String(organizations[0].id),
      }));
    }
  }, [organizations, formData.organizationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.organizationId ||
      !formData.locationName ||
      !formData.startsAt
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      organizationId: Number(formData.organizationId),
      locationName: formData.locationName.trim(),
      startsAt: formData.startsAt,
      endsAt: formData.endsAt || null,
      meals: formData.meals ? parseInt(formData.meals, 10) : 0,
      status: formData.status || "ACTIVE",
    };

    onCreateEvent(payload);
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
            <label className="form-label">Organization *</label>
            <select
              name="organizationId"
              value={formData.organizationId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
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
            <label className="form-label">End Date & Time</label>
            <input
              type="datetime-local"
              name="endsAt"
              value={formData.endsAt}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Meals</label>
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
            <label className="form-label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="ACTIVE">Active</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
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

const HeaderWithTabs = ({ activeTab, onTabChange, userRole, userName }) => {
  const tabs = ["Active Events", "Completed", "Profile"];
  const roleLabel = userRole === "FACULTY" ? "Faculty / Staff" : "Student";
  const signedInLabel = userName
    ? `${userName} · ${roleLabel}`
    : roleLabel;

  return (
    <header className="app-header">
      <h1 className="app-title">Event Dashboard</h1>
      <div className="role-indicator">Signed in as: {signedInLabel}</div>
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

const ROLE_KEY = "c4g-role";
const USERNAME_KEY = "c4g-username";
const ACCOUNTS_KEY = "c4g-accounts";

const App = () => {
  const [activeTab, setActiveTab] = useState("Active Events");
  const [events, setEvents] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem(ROLE_KEY));
  const [userName, setUserName] = useState(() => localStorage.getItem(USERNAME_KEY));
  const [accounts, setAccounts] = useState(() => {
    const base = { FACULTY: [], STUDENT: [] };
    try {
      const stored = localStorage.getItem(ACCOUNTS_KEY);
      if (stored) return { ...base, ...JSON.parse(stored) };
    } catch (_) {
      /* ignore */
    }
    return base;
  });
  const [selectedRole, setSelectedRole] = useState("FACULTY");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${API_BASE}/organizations`);
      if (!response.ok) throw new Error("Failed to fetch organizations");
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem(ROLE_KEY, userRole);
    } else {
      localStorage.removeItem(ROLE_KEY);
    }
  }, [userRole]);

  useEffect(() => {
    if (userName) {
      localStorage.setItem(USERNAME_KEY, userName);
    } else {
      localStorage.removeItem(USERNAME_KEY);
    }
  }, [userName]);

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    setAuthMessage("");
  }, [selectedRole]);

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterInput = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const username = loginForm.username.trim();
    const password = loginForm.password.trim();
    if (!username || !password) {
      setAuthMessage("Please enter your NetID and BluePassword.");
      return;
    }
    const roleAccounts = accounts[selectedRole] || [];
    const match = roleAccounts.find(
      (acc) => acc.username.toLowerCase() === username.toLowerCase()
    );
    if (!match || match.password !== password) {
      setAuthMessage("Invalid credentials for this role.");
      return;
    }
    setUserRole(selectedRole);
    setUserName(match.username);
    setAuthMessage("");
    setLoginForm({ username: "", password: "" });
    setRegisterForm({ username: "", password: "" });
  };

  const handleRegister = () => {
    const username = registerForm.username.trim();
    const password = registerForm.password.trim();
    if (!username || !password) {
      setAuthMessage("Please provide a NetID and BluePassword to register.");
      return;
    }
    const roleAccounts = accounts[selectedRole] || [];
    if (
      roleAccounts.some(
        (acc) => acc.username.toLowerCase() === username.toLowerCase()
      )
    ) {
      setAuthMessage("That NetID already exists for this role. Please log in.");
      return;
    }
    const updatedAccounts = {
      ...accounts,
      [selectedRole]: [...roleAccounts, { username, password }],
    };
    setAccounts(updatedAccounts);
    setAuthMessage("Account created! You can log in now.");
    setRegisterForm({ username: "", password: "" });
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName(null);
    setSelectedRole("FACULTY");
    setAuthMessage("");
    setLoginForm({ username: "", password: "" });
    setRegisterForm({ username: "", password: "" });
    setActiveTab("Active Events");
  };

  const fetchEventById = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/events/${id}`);
      if (!response.ok) throw new Error("Event not found");
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkCompleted = async (id) => {
    if (userRole !== "FACULTY") {
      return;
    }
    try {
      const event = events.find((e) => e.id === id);
      if (!event) return;

      const updatedEvent = {
        title: event.title,
        description: event.description,
        organizationId: event.organizationId,
        locationId: event.locationId,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        meals: 0,
        status: "ENDED",
      };

      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) throw new Error("Failed to update event");
      await fetchEvents();
    } catch (error) {
      console.error("Error marking event as completed:", error);
    }
  };

  const handleCreateEvent = async (eventData) => {
    if (userRole !== "FACULTY") {
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to create event");

      await fetchEvents();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (userRole !== "FACULTY") {
      return;
    }
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete event");
      await fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleViewDetails = (id) => {
    fetchEventById(id);
  };

  const canManage = userRole === "FACULTY";

  const filteredEvents = events.filter((event) => {
    if (activeTab === "Active Events") return event.status === "ACTIVE";
    if (activeTab === "Completed")
      return event.status === "ENDED" || event.status === "CANCELLED";
    return true;
  });

  const renderContent = () => {
    switch (activeTab) {
      case "Active Events":
      case "Completed":
        return (
          <div className="content-container">
            <div className="content-header">
              <h2 className="content-title">{activeTab}</h2>
              {activeTab === "Active Events" && canManage && (
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
                    canManage={canManage}
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
                    <strong>Organization:</strong>{" "}
                    {selectedEvent.organizationName}
                  </p>
                  <p className="event-details-info">
                    <strong>Location:</strong>{" "}
                    {selectedEvent.locationDetails ||
                      selectedEvent.locationName}
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
            <h2 className="content-title">Account</h2>
            <p className="profile-message">
              Signed in as <strong>{userName}</strong> (
              {userRole === "FACULTY" ? "Faculty / Staff" : "Student"}). Choose
              "Log out" to switch roles or sign in with another account.
            </p>
            <button className="button-secondary" onClick={handleLogout}>
              Log out
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!userRole) {
    const roleDescription =
      selectedRole === "FACULTY"
        ? "Faculty & Staff accounts can create and manage events."
        : "Student accounts can view active and completed events.";
    return (
      <div className="app">
        <div className="content-container">
          <h2 className="content-title">Welcome to the Event Portal</h2>
          <p className="profile-message">
            Select the type of account you would like to use for this prototype.
            Your username should be your NetID and your password should be your
            BluePassword.
          </p>
          <div className="role-selection-buttons">
            <button
              className={
                selectedRole === "FACULTY"
                  ? "button-primary"
                  : "button-secondary"
              }
              onClick={() => setSelectedRole("FACULTY")}
            >
              Faculty / Staff
            </button>
            <button
              className={
                selectedRole === "STUDENT"
                  ? "button-primary"
                  : "button-secondary"
              }
              onClick={() => setSelectedRole("STUDENT")}
            >
              Student
            </button>
          </div>
          <p className="profile-message">{roleDescription}</p>
          <div className="auth-forms">
            <div className="auth-card">
              <h3>Log In</h3>
              <input
                type="text"
                name="username"
                placeholder="NetID"
                value={loginForm.username}
                onChange={handleLoginInput}
                className="form-input"
              />
              <input
                type="password"
                name="password"
                placeholder="BluePassword"
                value={loginForm.password}
                onChange={handleLoginInput}
                className="form-input"
              />
              <button className="button-primary" onClick={handleLogin}>
                Log In
              </button>
            </div>
            <div className="auth-card">
              <h3>Create Account</h3>
              <input
                type="text"
                name="username"
                placeholder="NetID"
                value={registerForm.username}
                onChange={handleRegisterInput}
                className="form-input"
              />
              <input
                type="password"
                name="password"
                placeholder="BluePassword"
                value={registerForm.password}
                onChange={handleRegisterInput}
                className="form-input"
              />
              <button className="button-secondary" onClick={handleRegister}>
                Create Account
              </button>
            </div>
          </div>
          {authMessage && <p className="auth-message">{authMessage}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <HeaderWithTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        userName={userName}
      />
      <main className="app-main-content">{renderContent()}</main>

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreateEvent={handleCreateEvent}
          organizations={organizations}
        />
      )}
    </div>
  );
};

export default App;
