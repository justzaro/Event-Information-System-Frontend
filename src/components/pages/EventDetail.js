import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import './EventDetail.css'; // Import the CSS file

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);


  useEffect(() => {
    // Fetch the event data based on the eventId and set it in state
    fetch(`http://localhost:8080/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
      });
  }, [eventId]);

  const handleDecrease = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(ticketQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (ticketQuantity < 10) {
      setTicketQuantity(ticketQuantity + 1);
    }
  };

  return (
    <div className="event-detail-container">
      {event ? (
        <div>
          <div className="event-header">
            <Link to="/">
              <FontAwesomeIcon icon={faHouse} className="small-icon" />
            </Link>
            <span>{">>"} </span>
            <Link to="/events" className="event-link">
              Events
            </Link>
            <span> {">>"} </span>
            <span className="event-name">{event.name}</span>
          </div>

          <div className="event-content">
            <div className="event-image">
              <img
                src={`http://localhost:8080/events/event-picture/${event.name}`}
                alt="Event Banner"
              />
            </div>

            <div className="event-info">
              <h1 className="event-name-big">{event.name}</h1>

              <div className="price-box">
                <div className="ticket-price-info"><FontAwesomeIcon icon={faCircleInfo} /> Exclusive Online Price</div>
                <div className="ticket-price">{(event.ticketPrice).toFixed(2)} BGN</div>
                <hr className="divider" />
                <div className="ticket-controls">
                  <button className="control-button" onClick={handleDecrease}>-</button>
                  <input
                    type="number"
                    className="ticket-input"
                    value={ticketQuantity}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      if (!isNaN(newValue) && newValue >= 1 && newValue <= 10) {
                        setTicketQuantity(newValue);
                      }
                    }}
                    min="1"
                    max="10" // Adjust the maximum number of tickets
                  />
                  <button className="control-button" onClick={handleIncrease}>+</button>
                  <button className="buy-button">Buy</button>
                </div>
                <hr className="divider" />
                <div className="event-location">
                    <img
                      src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7832205/location-icon-md.png"
                      alt="Location Icon"
                      className="event-details-location"
                    /> Location: {event.location}
                </div>
              </div>

              <div className="event-description-heading">Description</div>
              <div className="event-description">{event.description}</div>

              <div className="event-artists-heading">Artists:</div>
              <div className="event-artists">
                {event.artists.map((artist, index) => (
                  <span key={index} className="artist-name">
                    {artist.firstName} {artist.lastName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading event data...</p>
      )}
    </div>
  );
};

export default EventDetail;
