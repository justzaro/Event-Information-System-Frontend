import React, { useState } from 'react';
import styles from './Register.module.css'; // Import CSS module

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


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

  const handleRegister = (e) => {
    e.preventDefault();
    // Perform your registration logic here with formData
    console.log(formData);
  };

  return (
    <div className={styles['registration-form']}>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
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
