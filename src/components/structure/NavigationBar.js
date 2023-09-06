import React from 'react';
import styles from './NavigationBar.module.css'; // Import CSS module
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
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
          <Link to="/events" className={styles['nav-link']}>
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
            Support Tickets
          </Link>
        </li>
        {/* Add more navigation items as needed */}
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
  );
};

export default NavigationBar;
