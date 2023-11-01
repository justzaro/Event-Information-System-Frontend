import React, { useState, useEffect } from 'react';
import styles from './Events.module.css'; // Import CSS module
import { Link } from 'react-router-dom';


const Events = () => {
  const [eventData, setEventData] = useState([]);
  const [error, setError] = useState(null);

  function extractTimeAndDate(dateTimeString) {
    const spaceIndex = dateTimeString.indexOf(' ');
    if (spaceIndex !== -1) {
      const time = dateTimeString.substring(0, spaceIndex);
      const date = dateTimeString.substring(spaceIndex + 1);
      return { time, date };
    }
    return { time: '', date: '' };
  }

  function truncateDescription(description, wordLimit) {
    const words = description.split(' ');
    if (words.length <= wordLimit) {
      return description;
    } else {
      const truncatedWords = words.slice(0, wordLimit);
      return truncatedWords.join(' ') + ' ...';
    }
  }  

  useEffect(() => {
    // Fetch events data
    fetch('http://localhost:8080/events?type=CONCERT')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched eventData:', data);
        setEventData(data);
      })
       .catch((error) => setError(error.message));
  }, []);

  return (
    
      <div>
        <h1>Eventsss</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : eventData.length > 0 ? (
          <div className={styles['event-cards-container']}>
            {eventData.map((event, index) => (
              <div key={index} className={styles['event-card']}>
                <Link to={`/concerts/${event.id}`}>                
                <img
                  src={`http://localhost:8080/events/event-picture/${event.name}`}
                  alt={`${event.name}'s Event`}
                  className={styles['event-picture']}
                />
                <div className={styles['event-info']}>
                  <p className={styles['event-name']}>{event.name}</p>
                  <div className={styles['event-date']}>
                    <img
                      src="https://www.freeiconspng.com/thumbs/calendar-icon-png/calendar-icon-png-4.png"
                      alt="Calendar Icon"
                      className={styles['icon']}
                    />
                    <p>
                      {extractTimeAndDate(event.startDate).date} -{' '}
                      {extractTimeAndDate(event.endDate).date}
                    </p>
                  </div>
                  <div className={styles['event-time']}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/184/184650.png"
                      alt="Clock Icon"
                      className={styles['icon']}
                    />
                    <p>
                      {extractTimeAndDate(event.startDate).time} -{' '}
                      {extractTimeAndDate(event.endDate).time}
                    </p>
                  </div>
                  <div className={styles['event-location']}>
                    <img
                      src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7832205/location-icon-md.png"
                      alt="Location Icon"
                      className={styles['icon']}
                    />
                    <p>{event.location}</p>
                  </div>
                  <p>{truncateDescription(event.description, 40)}</p> {/* Adjust 20 to your desired word limit */}
                </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading event data...</p>
        )}
      </div>
   
  );
};

export default Events;
