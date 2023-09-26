import React, { useState, useEffect, useRef } from 'react';
import styles from './NavigationBar.module.css'; // Import CSS module
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUsernameFromToken } from '../utility/AuthUtils';
import ProfileDropdown from './ProfileDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0); // Default value, you can change it

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationMenuRef = useRef(null);

  const [notificationOptionsVisible, setNotificationOptionsVisible] = useState(Array(notifications.length).fill(false));


  // Function to fetch notifications when the page is initially rendered

  const toggleNotificationOptions = (index) => {
    const newVisibility = [...notificationOptionsVisible];
    newVisibility[index] = !newVisibility[index];
    setNotificationOptionsVisible(newVisibility);
  };

  const markAsRead = (notification) => {
    // Implement the logic to mark the notification as read here
    // You can send a request to your server to update the notification status
    console.log('Mark as Read:', notification);
  };
  
  const removeComment = (notification) => {
    // Implement the logic to remove the comment here
    // You can send a request to your server to delete the comment
    console.log('Remove Comment:', notification);
  };
  // Function to handle notification bell icon click

  const calculateTimeDifference = (postedAt) => {
    const currentDate = new Date();
    const [time, date] = postedAt.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    const [day, month, year] = date.split('-').map(Number);
  
    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(day) && !isNaN(month) && !isNaN(year)) {
      // Create a Date object for the post's date and time
      const postDate = new Date(year, month - 1, day, hours, minutes); // Months are zero-based (0-11)
  
      // Calculate the time difference in milliseconds
      const timeDifference = currentDate - postDate;
  
      // Calculate days, hours, and minutes
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
      if (daysDifference > 0) {
        // Display days if difference is greater than 0
        return `${daysDifference}d`;
      } else if (hoursDifference > 0) {
        // Display hours if difference is greater than 0
        return `${hoursDifference}h`;
      } else if (minutesDifference > 0) {
        // Display minutes if difference is greater than 0
        return `${minutesDifference}m`;
      } else {
        // Display seconds if no significant difference
        return 'Just now';
      }
    }
  
    // Handle invalid date or time format
    return 'Invalid Date or Time Format';
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (loggedIn) {
        try {
          const username = getUsernameFromToken();
          const jwtToken = localStorage.getItem('jwtToken');

          const response = await fetch(`http://localhost:8080/posts/${username}/comments`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
            console.log(data);
          } else {
            console.error('Error fetching notifications:', response.status);
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    // Fetch notifications initially
    fetchNotifications();

    // Set up an interval to fetch notifications every 5 seconds
    const intervalId = setInterval(fetchNotifications, 5000);

    // Clean up the interval when the component unmounts or when loggedIn changes
    return () => {
      clearInterval(intervalId);
    };
  }, [loggedIn]);

  useEffect(() => {
    // Add a click event listener to the document
    const handleClickOutside = (event) => {
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target) &&
        showNotifications // Close the menu only if it's currently open
      ) {
        // Click occurred outside the open notification menu
        setShowNotifications(false); // Close the menu
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setLoggedIn(false);
  };

  useEffect(() => {
    // Update the loggedIn state whenever the location changes
    setLoggedIn(isAuthenticated());

    // Make a GET request to fetch the cart item count
    if (loggedIn) {
      const username = getUsernameFromToken();
      const jwtToken = localStorage.getItem('jwtToken');

      fetch(`http://localhost:8080/cart/number/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCartItemCount(data); // Update the cart item count from the response
        })
        .catch((error) => {
          console.error('Error fetching cart item count:', error);
        });
    }
  }, [location.pathname, loggedIn]);


  const handleProfileMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleProfileMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications); // Toggle the visibility of the notifications box
  };
  
  useEffect(() => {
    // Add a global click event listener
    const handleGlobalClick = (event) => {
      if (
        showNotifications &&
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target)
      ) {
        // Click occurred outside the notification menu while it's open
        setShowNotifications(false); // Close the menu
      }
    };

    // Attach the global click event listener when the component mounts
    document.addEventListener('click', handleGlobalClick);

    // Remove the global click event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [showNotifications]);

  return (

    <div>


      {/* LEFT SIDE */}

      {/* RIGHT SIDE */}

      {loggedIn ? (

        <div className={styles.navbar}>

          <ul className={styles['nav-list']}>
            <li className={styles['nav-image-container']}>
              <Link to="/" className={styles['nav-link']}>
                <img
                  src="https://www.freeiconspng.com/thumbs/hd-tickets/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
                  alt="Ticket Master"
                  className={styles['nav-image']}
                />
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/events"
                className={styles['nav-link']}
              >
                Events
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/users" className={styles['nav-link']}>
                Users
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/posts" className={styles['nav-link']}>
                Posts
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/support-tickets" className={styles['nav-link']}>
                Support
              </Link>
            </li>
          </ul>

          <div className={styles['nav-right']}>
            <ul className={styles['nav-list']}>

            <li className={styles['nav-item']} onClick={handleBellClick}>
            <FontAwesomeIcon icon={faBell} className={styles['custom-notification-bell']} />
            
          </li>

          {showNotifications && (
                    
                    
        <div className={styles['notification-menu']}>
          {notifications.map((notification, index) => (
                    

            <div key={index} className={styles['notification-item']}>
              <img
                src={`http://localhost:8080/users/profile-picture/${notification.user.username}`}
                alt={`${notification.user.username}'s profile`}
                className={styles['notification-profile-image']}
              />
              
              <div className={styles['notification-text']}>
                <p className={styles['notification-username']}>{notification.user.username}
                  <span className={styles['notification-comment']}> commented on your post!</span>
                </p>
                {/* <p className={styles['notification-comment']}></p> */}
                <p className={styles['notification-date']}>
                  {calculateTimeDifference(notification.postedAt)}
                  {calculateTimeDifference(notification.postedAt) !== 'Just now' ? ' ago' : ''}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                className={styles['ellipsis-icon']}
                onClick={() => toggleNotificationOptions(index)} // Toggle options menu visibility
              />
              {notificationOptionsVisible[index] && (
                <div className={styles['notification-options']}>
                  <button onClick={() => markAsRead(notification)}>Mark as Read</button>
                  <button onClick={() => removeComment(notification)}>Remove Comment</button>
                </div>
              )}
              </div>
          ))}
        
        </div>
      )}


              <li className={styles['nav-item']}>
                <Link to="/cart"
                >
                  <FontAwesomeIcon icon={faBagShopping} className={styles['shopping-bag']} />
                  {/* maybe remove red dot if count is 0 */}
                  <div className={styles['shopping-bag-dot']}>{cartItemCount}</div>
                </Link>
              </li>

              <li
                className={styles['nav-item']}
                onMouseEnter={handleProfileMouseEnter}
                onMouseLeave={handleProfileMouseLeave}
              >
                {/* maybe add to="/events" */}
                <Link className={styles['nav-link']}>
                  My Profile <FontAwesomeIcon icon={faChevronDown} className={styles['my-profile-arrow']} />
                </Link>
                <ProfileDropdown showDropdown={showDropdown} handleLogout={handleLogout} />
                {/* maybe remove handleLogout in profile dropwndown */}
              </li>

              <li className={styles['nav-item']}>
                <Link to="/"
                  className={styles['nav-link']}
                  onClick={handleLogout}
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (

        <div className={styles.navbar}>
          <ul className={styles['nav-list']}>
            <li className={styles['nav-image-container']}>
              <Link to="/" className={styles['nav-link']}>
                <img
                  src="https://www.freeiconspng.com/thumbs/hd-tickets/download-ticket-ticket-free-entertainment-icon-orange-ticket-design-0.png"
                  alt="Ticket Master"
                  className={styles['nav-image']}
                />
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/events"
                className={styles['nav-link']}
              >
                Events
              </Link>
            </li>

          </ul>

          <div className={styles['nav-right']}>
            <ul className={styles['nav-list']}>
              <li className={styles['nav-item']} style={{ marginTop: '0px' }}>
                <Link to="/log-in" className={styles['nav-link']}>
                  Log In
                </Link>
              </li>
              <li className={styles['nav-item']} style={{ marginTop: '0px' }}>
                <Link to="/register" className={styles['nav-link']}>
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* RIGHT SIDE */}

    </div>
  );
};

export default NavigationBar;
