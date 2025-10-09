import React, { useState } from 'react'; // Import useState
import { MapPin, Clock, Users } from 'lucide-react';
import './App.css';

// --- (Existing EventCard component remains the same) ---
const EventCard = ({ event }) => {
    const isActive = event.status === 'Active';

    return (
        <div className={`event-card${!isActive ? ' inactive' : ''}`}>
            <div className="event-card-header">
                <h3 className={`event-card-title${!isActive ? ' inactive' : ''}`}>{event.title}</h3>
                <div className={`event-card-status${!isActive ? ' inactive' : ''}`}>
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
                    <span className="event-card-detail-text">Est. Meals Available: {event.meals}</span>
                </p>
            </div>

            {isActive && (
                <button className="event-card-button">
                    View Details & Claim
                </button>
            )}
        </div>
    );
};
// --- (End of EventCard) ---

// Sample data for demonstration
const sampleEvent = {
    title: "Community Food Drive",
    status: "Active",
    location: "123 Main St, Springfield",
    time: "April 15, 2024, 10:00 AM - 2:00 PM",
    meals: 150
}

const sampleEventInactive = {
    title: "Past Volunteer Day",
    status: "Completed",
    location: "456 Oak Ave, Shelbyville",
    time: "March 1, 2024, 9:00 AM - 1:00 PM",
    meals: 0
}

// ---------------------------------------------
// NEW Component: Header with Tabs
// ---------------------------------------------
const HeaderWithTabs = ({ activeTab, onTabChange }) => {
    const tabs = ['Active Events', 'Completed', 'Profile'];

    return (
        <header className="app-header">
            <h1 className="app-title">Event Dashboard</h1>
            <nav className="tab-navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
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
// App Component (Main Logic)
// ---------------------------------------------
const App = () => {
    // 1. Initialize state for the active tab, defaulting to 'Active Events'
    const [activeTab, setActiveTab] = useState('Active Events');

    // 2. Define the content to display based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'Active Events':
                return (
                    <div className="content-container">
                        <h2>Current Events</h2>
                        <EventCard event={sampleEvent} />
                        <EventCard event={{...sampleEvent, title: "Upcoming Meal Prep"}} />
                    </div>
                );
            case 'Completed':
                return (
                    <div className="content-container">
                        <h2>Past Events</h2>
                        <EventCard event={sampleEventInactive} />
                        <p>No other completed events found.</p>
                    </div>
                );
            case 'Profile':
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
            {/* 3. Render the Header, passing the state and the state updater */}
            <HeaderWithTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <main className="app-main-content">
                {/* 4. Render the content based on the active tab */}
                {renderContent()}
            </main>
        </div>
    );
}

export default App;