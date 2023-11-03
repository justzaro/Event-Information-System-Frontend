import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileDropdown.module.css'; // Create a CSS module for the dropdown styles

const ProfileDropdown = ({ showDropdown }) => {
  return (
    <div className={styles.dropdownContainer}>
      <div className={`${styles.dropdown} ${showDropdown ? styles.active : ''}`}>
        <ul className={styles['dropdown-list']}>
          {/* Add dropdown menu items here */}
          <li>
            <Link to="/profile-settings">Profile Settings</Link>
          </li>
          <li>
            <Link to="/my-orders">My Orders</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
