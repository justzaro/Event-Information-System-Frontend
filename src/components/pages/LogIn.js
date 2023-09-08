import React, { useState, useEffect } from 'react';
import styles from './LogIn.module.css'; // Import CSS module
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye as solidEye } from '@fortawesome/free-solid-svg-icons';
import { faEye as thinEye } from '@fortawesome/free-regular-svg-icons';

function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const confirmationStatus = queryParams.get('confirmationStatus');

  useEffect(() => {
    if (confirmationStatus === 'success') {
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 4000);
    } else if (confirmationStatus === 'failure') {
      setShowFailMessage(true);

      setTimeout(() => {
        setShowFailMessage(false);
      }, 4000);
    }
  }, [confirmationStatus]);

  const handleLogin = () => {
    if (email && password) {
      // Handle the login logic here, e.g., send a request to your backend
      alert(`Logged in with Email: ${email} and Password: ${password}`);
    } else {
      alert('Please fill in both fields.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.LogIn}>
      {showSuccessMessage && (
        <div className={styles['success-message']}>
          Account confirmed successfully!
        </div>
      )}
      {showFailMessage && (
        <div className={styles['fail-message']}>
          There was a problem confirming your account!
        </div>
      )}

      <div className={styles['login-container']}>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles['large-input']} // Use styles from the module
          />
        </div>
        <div className={styles['input-container']}>
          <input
            id="passwordInput"
            type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles['large-input']} ${
              showPassword ? styles['show-password'] : ''
            }`}
          />

          <FontAwesomeIcon
            icon={showPassword ? solidEye : thinEye} // Use solid or thin version based on showPassword
            className={styles['eye-icon']}
            onClick={togglePasswordVisibility}
          />
        </div>
        <button onClick={handleLogin} className={styles['large-button']}>
          Log In
        </button>

        <Link to="/events">
          <p>Forgotten Password?</p>
        </Link>

        <hr className={styles['line']} />

        <Link to="/events">
          <button className={styles['create-account-button']}>
            Create account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LogIn;
