import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getUsernameFromToken, isAuthenticated } from '../utility/AuthUtils';
import './EventDetail.css';

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const [showEventInfo, setShowEventInfo] = useState(false);

  const [showNotLoggedInMessage, setShowNotLoggedInMessage] = useState(false);
  const [showItemSuccessfullyAddedToCart, setShowItemSuccessfullyAddedToCart] = useState(false);

const toggleEventInfo = () => {
  setShowEventInfo(!showEventInfo);
};


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

  const handleAddToCart = () => {

    setTicketQuantity(1);

    if (!isAuthenticated()) {
      // Handle the case when the user is not authenticated (e.g., show a login modal)
      // You can customize this behavior based on your authentication implementation

      setShowNotLoggedInMessage(true);

        setTimeout(() => {
          setShowNotLoggedInMessage(false);
        }, 4000);

      return;
    }
  
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');
  
    if (username && jwtToken) {
      const cartItem = {
        eventName: event.name,
        username: username,
        ticketQuantity: ticketQuantity,
      };
  
      // Make a POST request to add the item to the cart
      fetch('http://localhost:8080/cart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      })
        .then((response) => {
          if (response.ok) {
            // Handle success (e.g., show a success message)
            setShowItemSuccessfullyAddedToCart(true);

            setTimeout(() => {
              setShowItemSuccessfullyAddedToCart(false);
            }, 4000);
            console.log('Item added to cart successfully');
          } else {
            // Handle error (e.g., show an error message)
            console.error('Error adding item to cart:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error adding item to cart:', error);
        });
    }
  };

  return (
    <div className="event-detail-container">

        {showNotLoggedInMessage && (
          <div className="not-logged-in-message">Log in before adding items to the cart!</div>
        )}
        {showItemSuccessfullyAddedToCart && (
          <div className="successful-cart-addition-message">Item added successfully!</div>
        )}

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
                  <button className="buy-button" onClick={handleAddToCart}>Add to Cart</button>
                </div>
                <hr className="divider" />
                <div className="event-location">
                    <img
                      src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7832205/location-icon-md.png"
                      alt="Location Icon"
                      className="event-details-location"
                    />
                    <span className="location-text"> Location:</span> {event.location}
                </div>
              </div>

              <div className="event-description-heading">Description</div>

              <div className="event-artists-heading"><FontAwesomeIcon icon={faMusic}/> Artists:</div>
              <div className="event-artists">
                {event.artists.map((artist, index) => (
                  <span key={index} className="artist-name">
                    {artist.firstName} {artist.lastName}
                  </span>
                ))}
              </div>
              <div className="event-starting-hour">
  <FontAwesomeIcon icon={faClock} color="#ff6600"/>
  <span className="orange-text"> Starts at:</span> {event.startDate}
</div>
<div className="event-closing-hour">
  <FontAwesomeIcon icon={faClock} color="#ff6600"/>
  <span className="orange-text"> Ends at:</span> {event.endDate}
</div>
                  
              <div className="event-info-toggle">
                <div className="horizontal-line above"></div>
                <div className="event-info-header">Event Information</div>
                <div className="see-more" onClick={toggleEventInfo}>
                {showEventInfo ? 'See Less' : 'See More'}

                </div>
                
                {showEventInfo && (
                  <div className={`extra-info ${showEventInfo ? 'show-info' : ''}`}>
                  {/* Add the extra text you want to display */}
                  {event.description}
                  </div>
                )}
                <div className={`horizontal-line below ${showEventInfo ? 'expanded' : ''}`}></div>
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