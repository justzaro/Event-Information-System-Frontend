import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfileDropdown.module.css'; // Create a CSS module for the dropdown styles

const ProfileDropdown = ({showDropdown}) => {

  const dropdownClass = `${styles.dropdown} ${showDropdown ? styles.active : ''}`;

  return (
    <div className={dropdownClass}>
      <ul className={styles['dropdown-list']}>
        {/* Add dropdown menu items here */}
        <li>
          <Link to="/profile/settings">Profile Settings</Link>
        </li>
        <li>
          <Link to="/profile/orders">My Orders</Link>
        </li>
        <li>
          <Link to="/profile/favorites">Favorites</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDropdown;
