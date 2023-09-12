import React, { useState, useEffect } from 'react';
import styles from './NavigationBar.module.css'; // Import CSS module
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated, getUsernameFromToken } from '../utility/AuthUtils';
import ProfileDropdown from './ProfileDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';

const NavigationBar = () => {

  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(3); // Default value, you can change it

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setLoggedIn(false);
  };

  useEffect(() => {
    // Update the loggedIn state whenever the location changes
    setLoggedIn(isAuthenticated());
    console.log(getUsernameFromToken());

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


  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleProfileMouseLeave = () => {
    setShowDropdown(false);
  };


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
              <Link to="/support-tickets" className={styles['nav-link']}>
                Support
              </Link>
            </li>
          </ul>

          <div className={styles['nav-right']}>
            <ul className={styles['nav-list']}>
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
                <Link to="/cart-items"
                >
                  <FontAwesomeIcon icon={faBagShopping} className={styles['shopping-bag']} />
                  <div className={styles['shopping-bag-dot']}>{cartItemCount}</div> {/* Change the number to represent the item count */}
                </Link>
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
              <li className={styles['nav-item']}>
                <Link to="/log-in" className={styles['nav-link']}>
                  Log In
                </Link>
              </li>
              <li className={styles['nav-item']}>
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
