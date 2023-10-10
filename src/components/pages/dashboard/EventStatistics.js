import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './EventStatistics.css';

const EventStatistics = () => {
  const [eventsCount, setEventsCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [selectedEventsRange, setSelectedEventsRange] = useState('7 days');
  const [selectedBookedRange, setSelectedBookedRange] = useState('7 days');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuType, setMenuType] = useState('events'); // State to track the menu type

  useEffect(() => {
    // Replace 'your_jwt_token' with the actual JWT token
    const jwtToken = localStorage.getItem('jwtToken');

    // Fetch data for the four statistics circles
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get('http://localhost:8080/events/upcoming?type=1', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const bookedResponse = await axios.get('http://localhost:8080/events/booked?type=1', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const activeResponse = await axios.get('http://localhost:8080/events/active', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const inactiveResponse = await axios.get('http://localhost:8080/events/inactive', {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        setEventsCount(eventsResponse.data);
        setBookedCount(bookedResponse.data);
        setActiveCount(activeResponse.data);
        setInactiveCount(inactiveResponse.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = (type) => {
    setMenuType(type);
    setMenuVisible(!menuVisible);
  };

  const handleMenuClick = (value) => {
    // Determine the type based on the selected value
    let type;
    switch (value) {
      case '7 days':
        type = 1;
        break;
      case '30 days':
        type = 2;
        break;
      case '90 days':
        type = 3;
        break;
      case '180 days':
        type = 4;
        break;
      case '360 days':
        type = 5;
        break;
      default:
        type = 1; // Default to 7 days
    }

    if (menuType === 'events') {
        setSelectedEventsRange(value);
      } else {
        setSelectedBookedRange(value);
      }

    // Make the GET request based on menu type (events or booked)
    const endpoint =
      menuType === 'events'
        ? `http://localhost:8080/events/upcoming?type=${type}`
        : `http://localhost:8080/events/booked?type=${type}`;

    // Replace 'your_jwt_token' with the actual JWT token
    const jwtToken = localStorage.getItem('jwtToken');

    // Fetch data based on the selected type
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        // Update the count based on the response
        if (menuType === 'events') {
          setEventsCount(response.data);
        } else {
          setBookedCount(response.data);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();

    // Close the menu after selection
    setMenuVisible(false);
  };

  return (
    <div className="event-statistics-container">
      <div className="event-statistics-item">
        <div className="event-statistics-circle">
          <div className="event-statistics-number">{eventsCount}</div>
        </div>
        <div className="event-statistics-text">
          events
        </div>
        {menuVisible && menuType === 'events' && (
          <div className="event-statistics-menu">
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('7 days')}>
              7 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('30 days')}>
              30 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('90 days')}>
              90 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('180 days')}>
              180 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('360 days')}>
              360 days
            </div>
          </div>
        )}
        <div className="event-statistics-subtext" onClick={() => toggleMenu('events')}>
          in the next {selectedEventsRange}
        </div>
      </div>
      <div className="event-statistics-item">
        <div className="event-statistics-circle">
          <div className="event-statistics-number">{bookedCount}</div>
        </div>
        <div className="event-statistics-text">
          booked
        </div>
        {menuVisible && menuType === 'booked' && (
          <div className="event-statistics-menu">
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('7 days')}>
              7 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('30 days')}>
              30 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('90 days')}>
              90 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('180 days')}>
              180 days
            </div>
            <div className="event-statistics-menu-item" onClick={() => handleMenuClick('360 days')}>
              360 days
            </div>
          </div>
        )}
        <div className="event-statistics-subtext" onClick={() => toggleMenu('booked')}>
          in the last {selectedBookedRange}
        </div>
      </div>
      <div className="event-statistics-item">
        <div className="event-statistics-circle">
          <div className="event-statistics-number">{activeCount}</div>
        </div>
        <div className="event-statistics-text">active</div>
        <div className="event-statistics-subtext">
        <br></br>
        </div>
      </div>
      <div className="event-statistics-item">
        <div className="event-statistics-circle">
          <div className="event-statistics-number">{inactiveCount}</div>
        </div>
        <div className="event-statistics-text">inactive</div>
        <div className="event-statistics-subtext">
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default EventStatistics;
