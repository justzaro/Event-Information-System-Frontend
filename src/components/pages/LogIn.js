import React, { useState, useEffect } from 'react';
import styles from './LogIn.module.css';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye as solidEye } from '@fortawesome/free-solid-svg-icons';
import { faEye as thinEye } from '@fortawesome/free-regular-svg-icons';

function LogIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const confirmationStatus = queryParams.get('confirmationStatus');

  const navigate = useNavigate();

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

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await fetch('http://localhost:8080/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          const jwtToken = data.token;
  
          localStorage.setItem('jwtToken', jwtToken);
          navigate('/concerts');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message);

          setShowFailMessage(true);

          setTimeout(() => {
            setShowFailMessage(false);
          }, 4000);
        }
      } catch (error) {
        console.error('An error occurred during login:', error);
      }
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
          {errorMessage}
        </div>
      )}

      <div className={styles['login-container']}>
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles['large-input']}
          />
        </div>
        <div className={styles['input-container']}>
          <input
            id="passwordInput"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles['large-input']} ${
              showPassword ? styles['show-password'] : ''
            }`}
          />

          <FontAwesomeIcon
            icon={showPassword ? solidEye : thinEye}
            className={styles['eye-icon']}
            onClick={togglePasswordVisibility}
          />
        </div>
        <button onClick={handleLogin} className={styles['large-button']}>
          Log In
        </button>

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
