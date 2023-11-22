import React, { useState, useEffect } from 'react';
import './EventsOverview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons';

const EventsOverview = () => {
    const [events, setEvents] = useState([]);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('');
    const [showEventDeletedMessage, setEventDeletedMessage] = useState(null);

    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [confirmationType, setConfirmationType] = useState('');
    const [confirmationEventId, setConfirmationEventId] = useState('');

    const fetchEvents = () => {
        fetch('http://localhost:8080/events')
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    };

    useEffect(() => {
        fetchEvents(); // Call fetchEvents when the component mounts
    }, []); // Empty dependen

    const handleMouseEnter = (event) => {
        setHoveredEvent(event.id);
        setIsAnimating(true);
    };

    const handleMouseLeave = () => {
        setHoveredEvent(null);
        setIsAnimating(true);
    };

    const handleItemClick = (event) => {
        // Toggle expanded state for the clicked item
        if (expandedItem === event.id) {
            setExpandedItem(null);
        } else {
            setExpandedItem(event.id);
        }
    };

    const handleToggleEventStatusMenu = (eventId) => {
        // Set confirmation details
        setConfirmationEventId(eventId);
        const event = events.find(e => e.id === eventId);
        setConfirmationType(event.isActive ? 'deactivate' : 'activate');
        // Show the confirmation dialog
        setShowConfirmationDialog(true);
    };

    const handleToggleEventActivityStatus = () => {
        // Call the API to toggle the event activity status
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            console.error('jwtToken is not available.');
            return;
        }

        const endpoint = `http://localhost:8080/events/activity-status/${confirmationEventId}`;
        fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: confirmationType }),
        })
            .then((response) => {
                if (response.ok) {
                    setEventDeletedMessage(true);

                    setTimeout(() => {
                        setEventDeletedMessage(false);
                    }, 4000);

                    fetchEvents(); // Update events after successful toggle
                } else {
                    console.error('Error toggling event activity status.');
                }
                // Close the confirmation dialog
                setShowConfirmationDialog(false);
            })
            .catch((error) => {
                console.error('Network error:', error);
            });
    };


    const filteredEvents = events.filter((event) => {
        return (
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (eventTypeFilter === '' || event.eventType === eventTypeFilter)
        );
    });


    return (
        <div className="event-overview-container">

            {showEventDeletedMessage && (
                <div className="register-success-message">Event status toggled successfully!</div>
            )}

            <div className="search-and-filter-container">
                <div className="overview-search-container">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="overview-search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="overview-search-bar"
                    />
                </div>
                <div className="event-type-filter">
                    <select
                        id="eventType"
                        onChange={(e) => setEventTypeFilter(e.target.value)}
                        value={eventTypeFilter}
                    >
                        <option value="">All</option>
                        <option value="CONCERT">Concert</option>
                        <option value="FESTIVAL">Festival</option>
                    </select>
                </div>
            </div>
            {filteredEvents.map((event) => (

                <div
                    key={event.id}
                    className={`event-overview-item ${hoveredEvent === event.id ? 'hovered' : ''
                        } ${expandedItem === event.id ? 'expanded' : ''}`}
                    onMouseEnter={() => handleMouseEnter(event)}
                    onMouseLeave={handleMouseLeave}
                >
                    {hoveredEvent === event.id && (
                        <FontAwesomeIcon
                            icon={faX}
                            className="event-close-icon"
                            onClick={() => handleToggleEventStatusMenu(event.id)}
                        />
                    )}

                    {showConfirmationDialog && (
                        <div className="event-activity-confirmation-overlay">

                            <div className="event-activity-confirmation-dialog">
                                <p>{`Do you want to ${confirmationType} this ${event.eventType === 'CONCERT' ? 'concert' : 'festival'}?`}</p>
                                <button
                                    className={confirmationType === 'activate' ? 'event-activity-status-green-button' : 'event-activity-status-red-button'}
                                    onClick={handleToggleEventActivityStatus}
                                >
                                    Yes
                                </button>
                                <button
                                    className={confirmationType === 'activate' ? 'event-activity-status-red-button' : 'event-activity-status-green-button'}
                                    onClick={() => setShowConfirmationDialog(false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}

                    <img
                        className="event-overview-circle"
                        src={`http://localhost:8080/events/event-picture/${event.id}`}
                        alt={`Event: ${event.name}`}
                    />
                    <div className="event-overview-details">
                        <div className="event-overview-name">{event.name}</div>
                        <div className="event-overview-type">{event.type}</div>
                        <div className="event-overview-date">

                            Starts: {event.startDate}

                            <br />
                            <div className="event-overview-date-end">
                                Ends: {event.endDate}
                            </div>
                        </div>
                        {event.eventType === 'CONCERT' && (
                            <>
                                <div className="event-overview-price">Price: {event.ticketPrice.toFixed(2)} BGN </div>
                                <div className="event-overview-capacity">Capacity: {event.capacity}</div>
                            </>
                        )}
                        <div className="event-overview-artists" style={{ maxWidth: '400px' }}>
                            Artists: {''}
                            {event.artists.map((artist, index) => (
                                <span key={index}>
                                    {artist.firstName} {artist.lastName}
                                    {index < event.artists.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </div>
                        <div className="event-overview-location"> Location: {event.location}</div>
                        <div className="event-overview-rectangles">

                            {event.isActive ? (
                                <div className="event-overview-isActive-rectangle">
                                    <span className="event-overview-isActive-text">Active</span>
                                    {event.eventType === 'CONCERT' ? (
                                        <div className="event-overview-concert-rectangle">
                                            <span className="event-overview-event-text">Concert</span>
                                        </div>
                                    ) : (
                                        <div className="event-overview-festival-rectangle">
                                            <span className="event-overview-event-text">Festival</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="event-overview-isInactive-rectangle">
                                    <span className="event-overview-isActive-text">Inactive</span>
                                    {event.eventType === 'CONCERT' ? (
                                        <div className="event-overview-concert-rectangle">
                                            <span className="event-overview-event-text">Concert</span>
                                        </div>
                                    ) : (
                                        <div className="event-overview-festival-rectangle">
                                            <span className="event-overview-event-text">Festival</span>
                                        </div>
                                    )}
                                </div>

                            )}
                        </div>
                        <div className="event-overview-icon">
                            <FontAwesomeIcon
                                icon={faAngleDown}
                                className={isAnimating ? 'animating' : ''}
                                onClick={() => handleItemClick(event)}
                            />
                        </div>

                        <div className="event-overview-description">
                            Description: {event.description}
                        </div>

                    </div>

                </div>

            ))}
        </div>
    );
};

export default EventsOverview;
