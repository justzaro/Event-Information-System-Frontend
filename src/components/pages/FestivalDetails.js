import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { getUsernameFromToken, isAuthenticated } from '../utility/AuthUtils';
import './FestivalDetails.css';

const FestivalDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const [showEventInfo, setShowEventInfo] = useState(false);
  const [showArtistInfo, setShowArtistInfo] = useState(false);

  const [showNotLoggedInMessage, setShowNotLoggedInMessage] = useState(false);
  const [showItemSuccessfullyAddedToCart, setShowItemSuccessfullyAddedToCart] = useState(false);

const toggleEventInfo = () => {
  setShowEventInfo(!showEventInfo);
};

const toggleArtistInfo = () => {
  setShowArtistInfo(!showArtistInfo);
};


  useEffect(() => {
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
            setShowItemSuccessfullyAddedToCart(true);

            setTimeout(() => {
              setShowItemSuccessfullyAddedToCart(false);
            }, 4000);
            console.log('Item added to cart successfully');
          } else {
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
            <Link to="/festivals" className="event-link">
              Festivals
            </Link>
            <span> {">>"} </span>
            <span className="event-name">{event.name}</span>
          </div>

          <div className="event-content">
            <div className="event-image">
              <img
                src={`http://localhost:8080/events/event-picture/${event.id}`}
                alt="Event Banner"
              />
            </div>

            <div className="event-info">
              <h1 className="event-name-big">{event.name}</h1>

              <div className="event-description-whole-part">

              <div className="event-description-heading">Description</div>

              
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
                <div className="event-info-header">Artists Information</div>
                <div className="see-more" onClick={toggleArtistInfo}>
                  {showArtistInfo ? 'See Less' : 'See More'}
                </div>
                

                {showArtistInfo && (
                  <div className={`extra-info ${showArtistInfo ? 'show-info' : ''}`}>
                  {event.artists.map((artist, index) => (
                  <span key={index} className="artist-name">
                    {artist.firstName} {artist.lastName}
                  </span>
                ))}
                  </div>
                )}

                <div className={`horizontal-line below ${showArtistInfo ? 'expanded' : ''}`}></div>
              </div>

              <div className="event-info-toggle">
                <div className="horizontal-line above"></div>
                <div className="event-info-header">Event Information</div>
                <div className="see-more" onClick={toggleEventInfo}>
                {showEventInfo ? 'See Less' : 'See More'}

                </div>
                
                {showEventInfo && (
                  <div className={`extra-info ${showEventInfo ? 'show-info' : ''}`}>
                  {event.description}
                  </div>
                )}

                <div className={`horizontal-line below ${showEventInfo ? 'expanded' : ''}`}></div>
              </div>
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

export default FestivalDetails;