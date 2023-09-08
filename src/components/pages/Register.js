import React, { useState } from 'react';
import styles from './Register.module.css'; // Import CSS module

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye as solidEye } from '@fortawesome/free-solid-svg-icons';
import { faEye as thinEye } from '@fortawesome/free-regular-svg-icons';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthNameToValue = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    day: '',
    month: '',
    year: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage, setShowFailMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { day, month, year } = formData;
    const monthValue = monthNameToValue[month];
    // Perform your registration logic here with formData

    if (!monthValue) {
      console.error('Invalid month selected');
      return;
    }

    const formattedDayValue = day < 10 ? `0${day}` : day;

    const dateOfBirth = `${formattedDayValue}-${monthValue}-${year}`;
    
    const requestBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      dateOfBirth,
      address: formData.address,
    };

    try {
      const response = await fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Registration successful, handle success here
        console.log('Registration successful');

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          username: '',
          day: '',
          month: '',
          year: '',
          address: '',
        });

        setShowSuccessMessage(true);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 4000);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message;
        setErrorMessage(errorMessage);
        // Registration failed, handle error here
        setShowFailMessage(true);

        setTimeout(() => {
          setShowFailMessage(false);
        }, 4000);
        console.error(errorMessage);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
    

    console.log(requestBody);
  };

  return (
    <div className={styles['registration-form']}>


        {showSuccessMessage && (
          <div className={styles['register-success-message']}>Registration is successful!</div>
        )}
        {showFailMessage && (
          <div className={styles['register-fail-message']}>{errorMessage}</div>
        )}

      <h2>Registration</h2>
      <form onSubmit={handleRegister}>
        <div className={styles['form-group']}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <FontAwesomeIcon
            icon={showPassword ? solidEye : thinEye} // Use solid or thin version based on showPassword
            className={styles['register-eye-icon']}
            onClick={togglePasswordVisibility}
        />
        <div className={styles['form-group']}>
          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          >
            <option value="">Year</option>
            {Array.from({ length: 151 }, (_, i) => (
              <option key={i + 1900} value={i + 1900}>
                {i + 1900}
              </option>
            ))}
          </select>
        </div>
        <div className={styles['form-group']}>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <button type="submit" className={styles['register-button']}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
