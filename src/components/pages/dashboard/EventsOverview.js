import React, { useState, useEffect } from 'react';
import './EventsOverview.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const EventsOverview = () => {
    const [events, setEvents] = useState([]);
    const [hoveredEvent, setHoveredEvent] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [expandedItem, setExpandedItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState('');

    useEffect(() => {
        // Fetch the list of events from the provided endpoint
        fetch('http://localhost:8080/events')
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    }, []);

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


        const filteredEvents = events.filter((event) => {
            return (
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (eventTypeFilter === '' || event.eventType === eventTypeFilter)
            );
        });
    

    return (
        <div className="event-overview-container">
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
                    <img
                        className="event-overview-circle"
                        src={`http://localhost:8080/events/event-picture/${event.name}`}
                        alt="Event"
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
