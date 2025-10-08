import React from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import './App.css';

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

const sampleEvent = {
    title: "Community Food Drive",
    status: "Active",
    location: "123 Main St, Springfield",
    time: "April 15, 2024, 10:00 AM - 2:00 PM",
    meals: 150  
}

const App = () => {
    return (
        <div className="app">
            <EventCard event={sampleEvent} />
        </div>
    );
}

export default App;
