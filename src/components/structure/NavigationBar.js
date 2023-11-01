import React, { useState, useEffect, useRef, useCallback  } from 'react';
import styles from './NavigationBar.module.css'; // Import CSS module
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUsernameFromToken, isAdmin } from '../utility/AuthUtils';
import ProfileDropdown from './ProfileDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import { cartItemsCount } from '../utility/AuthUtils';

const NavigationBar = () => {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const userIsAdmin = isAdmin();
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0); // Default value, you can change it

  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [notificationOptionsVisible, setNotificationOptionsVisible] = useState(Array(notifications.length).fill(false));

  const [showCommentSuccessfullyRemovedMessage, setCommentSuccessfullyRemovedMessage] = useState(false);
  const [showCommentUnsuccessfullyRemovedMessage, setCommentUnsuccessfullyRemovedMessage] = useState(false);

  const [showCommentSuccessfullyMarkedAsRead, setCommentSuccessfullyMarkedAsRead] = useState(false);
  const [showCommentUnsuccessfullyMarkedAsRead, setCommentUnsuccessfullyMarkedAsRead] = useState(false);

  const unreadCommentCount = notifications.filter((comment) => !comment.isRead).length;

  const [isBellShaking, setIsBellShaking] = useState(false);

  const notificationMenuRef = useRef(null);
  const bellIconRef = useRef(null);
  const toggleOptionsMenuRef = useRef(null);
  const ellipsisIconRef = useRef(null); // Ref for the ellipsis icon

  useEffect(() => {
    const handleDocumentClick = (event) => {
      // Check if the click target is the bell icon or within the notification menu
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target) &&
        !bellIconRef.current.contains(event.target)
      ) {
        setShowNotifications(false); // Hide the notification menu
        setNotificationOptionsVisible(Array(notifications.length).fill(false));
      }
    };
  
    document.addEventListener('click', handleDocumentClick);
  
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
  
  const toggleNotificationOptions = (index) => {
    const newVisibility = [...notificationOptionsVisible];
    newVisibility[index] = !newVisibility[index];
    setNotificationOptionsVisible(newVisibility);
  };

  const triggerShakeAnimation = () => {
    setIsBellShaking(true);

    setTimeout(() => {
      setIsBellShaking(false);
    }, 1000);
  };

  const handleMarkAsReadClick = (index) => {
    markAsRead(notifications[index].id); // Call your markAsRead function
    hideNotificationOptions(index); // Hide the notification menu
  };

  const handleRemoveCommentClick = (index) => {
    removeComment(notifications[index].id); // Call your removeComment function
    hideNotificationOptions(index); // Hide the notification menu
  };

  const hideNotificationOptions = (index) => {
    const newVisibility = [...notificationOptionsVisible];
    newVisibility[index] = false;
    setNotificationOptionsVisible(newVisibility);
  };

  const markAsRead = async (commentId) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/comments/${commentId}/is-read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        triggerShakeAnimation();

        setCommentSuccessfullyMarkedAsRead(true);

        setTimeout(() => {
          setCommentSuccessfullyMarkedAsRead(false);
        }, 4000);

        fetchNotifications();
      } else {
        setCommentUnsuccessfullyMarkedAsRead(true);

        setTimeout(() => {
          setCommentUnsuccessfullyMarkedAsRead(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error marking comment as read:', error);
    }
  };

  const removeComment = async (commentId) => {

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      const response = await fetch(`http://localhost:8080/comments/${commentId}/is-removed`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        triggerShakeAnimation();

        setCommentSuccessfullyRemovedMessage(true);

        setTimeout(() => {
          setCommentSuccessfullyRemovedMessage(false);
        }, 4000);

        fetchNotifications();
      } else {
        setCommentUnsuccessfullyRemovedMessage(true);

        setTimeout(() => {
          setCommentUnsuccessfullyRemovedMessage(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error removing comment:', error);
    }
  };

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

  const fetchNotifications = useCallback(async () => {
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

          const filteredComments = data.filter((comment) => !comment.isRemoved);

          setNotifications(filteredComments);
        } else {
          console.error('Error fetching notifications:', response.status);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  }, [loggedIn]); // Make sure to list any dependencies that this function relies on

  useEffect(() => {
    const fetchNotificationsInterval = async () => {
      await fetchNotifications();
    };

    fetchNotificationsInterval();
    console.log("Called fetch notifications");
    const intervalId = setInterval(fetchNotificationsInterval, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]); // Empty dependency array to run once on mount


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
          setCartItemCount(data);
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
    setShowNotifications(!showNotifications);
  };


  return (

    <div>

      {showCommentSuccessfullyRemovedMessage && (
        <div className={styles['success-message']}>
          Comment was successfully removed!
        </div>
      )}
      {showCommentUnsuccessfullyRemovedMessage && (
        <div className={styles['fail-message']}>
          There was a problem removing the desired comment!
        </div>
      )}
      {showCommentSuccessfullyMarkedAsRead && (
        <div className={styles['success-message']}>
          Comment was successfully marked as read!
        </div>
      )}
      {showCommentUnsuccessfullyMarkedAsRead && (
        <div className={styles['fail-message']}>
          There was a problem marking the desired comment as read!
        </div>
      )}

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
                to="/concerts"
                className={styles['nav-link']}
              >
                Concerts
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/festivals"
                className={styles['nav-link']}
              >
                Festivals
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/posts" className={styles['nav-link']}>
                Posts
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/contact-us" className={styles['nav-link']}>
                Contact us
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link to="/about-us" className={styles['nav-link']}>
                About us
              </Link>
            </li>
          </ul>

          <div className={styles['nav-right']}>
            <ul className={styles['nav-list']}>

              
              {userIsAdmin && ( // Conditionally render the new nav-item only if isAdmin is true
                <li className={styles['nav-item']}>
                  {/* Content for the admin nav-item */}
                  <Link to="/dashboard" className={styles['nav-link']}>
                      Dashboard
                  </Link>
                </li>

              )}
              <li className={styles['nav-item']} onClick={handleBellClick} ref={bellIconRef}>
                <FontAwesomeIcon
                  icon={faBell}
                  className={`${styles['custom-notification-bell']} ${isBellShaking ? styles['shake'] : ''}`}
                />
                {unreadCommentCount > 0 && (
                  <div className={styles['custom-notification-dot']}>{unreadCommentCount}</div>
                )}
              </li>

              {showNotifications && (
                <div className={styles['notification-menu']} ref={notificationMenuRef}>
                  {notifications.length === 0 ? (
                    <p className={styles['no-notifications-message']}>There are no notifications for you yet.</p>
                  ) : (
                    notifications.map((notification, index) => (
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
                          <p className={styles['notification-date']}>
                            {calculateTimeDifference(notification.postedAt)}
                            {calculateTimeDifference(notification.postedAt) !== 'Just now' ? ' ago' : ''}
                          </p>
                        </div>
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          className={styles['ellipsis-icon']}
                          onClick={(e) => {
                            toggleNotificationOptions(index); // Toggle options menu visibility
                          }}
                          ref={ellipsisIconRef}
                        />
                        {notification.isRead ? null : (
                          <div className={styles['unread-message-dot']}></div>
                        )}
                        {notificationOptionsVisible[index] && (
                          <div className={styles['notification-options']} ref={toggleOptionsMenuRef}>
                            <button onClick={() => handleMarkAsReadClick(index)}>Mark as Read</button>
                            <button onClick={() => handleRemoveCommentClick(index)}>Remove Comment</button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
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
                to="/concerts"
                className={styles['nav-link']}
              >
                Concerts
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/festivals"
                className={styles['nav-link']}
              >
                Festivals
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/contact-us"
                className={styles['nav-link']}
              >
                Contact us
              </Link>
            </li>
            <li className={styles['nav-item']}>
              <Link
                to="/about-us"
                className={styles['nav-link']}
              >
                About us
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
