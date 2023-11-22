import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index manually


  useEffect(() => {
    // Fetch event data from the API endpoint
    fetch('http://localhost:8080/events')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
    console.log(events.length);
  }, []);

  const navigateLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(events.length - 6);
    }
  };

  const navigateRight = () => {
    if (startIndex + 6 < events.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
  };

  return (
    <div className={styles['home-container']}>

      <div className={styles['header-text']}>
        <h1 className={styles['main-event-heading']}>Our Most Prominent Events</h1>
        <p className={styles['main-event-slogan']}>Browse our vast selection of events, choose your favourites and reserve your tickets!</p>
      </div>


      {/* Event Carousel */}
      <div className={styles['events-carousel']}>
        <div className={styles['arrow']} onClick={navigateLeft}>
          &lt;
        </div>
        <div className={styles['events-container']}>
          {events.slice(startIndex, startIndex + 5).map((event, index) => (

            <div
              key={event.id}
              className={`${styles['event-box']} ${hoveredIndex === index + startIndex ? styles['hovered'] : ''
                }`}
              onClick={() => {
                // Redirect to /event/id
                // You can implement the redirection logic here
              }}
              onMouseEnter={() => setHoveredIndex(index + startIndex)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                  to={{
                    pathname: event.eventType === "CONCERT" ? `/concerts/${event.id}` : `/festivals/${event.id}`
                  }}
                  className={styles['no-underline-link']}
                >
                <img
                  src={`http://localhost:8080/events/event-picture/${event.id}`}
                  alt={event.name}
                />
                <button className={styles['buy-tickets-button']} onClick={() => {

                }}>
                  Buy Tickets
                </button>
                <div className={styles['event-details']}>
                  <p className={styles['event-name']}>{event.name}</p>
                  <p className={styles['event-price']}>{event.ticketPrice.toFixed(2)} лв.</p>
                  <img
                    src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7832205/location-icon-md.png"
                    alt="Location Icon"
                    className={styles['location-icon']}
                  />
                  <p className={styles['event-location']}>

                    {event.location.split(',')[0]}
                  </p>
                </div>

              </Link>
            </div>
          ))}
        </div>
        <div className={styles['arrow']} onClick={navigateRight}>
          &gt;
        </div>
      </div>

      <div className={styles['green-rectangle']}>
        <img
          src="https://www.freeiconspng.com/thumbs/hd-tickets/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
          alt="Ticket Master Logo"
        />
        <p>
          Добре дошли в нашия уебсайт за продажба на билети! Независимо дали сте
          страстен любител на концерти, фестивали или фотография, тук ще намерете
          по малко от всичко. Нашата мисия е да ви осигурим най-лесния начин за
          закупуване на билети за вашите любими събития, и то с най-добрите цени.
          С нашия интуитивен интерфейс можете бързо и лесно да намерите билетите,
          които търсите, както и информация за различни фестивали и любителска
          фотография. Ние предлагаме богат избор от концерти и мероприятия в
          цялата страна, за да можете да се насладите на най-доброто, което
          предлага културата и забавлението.
        </p>
      </div>
    </div>
  );
};

export default Home;
