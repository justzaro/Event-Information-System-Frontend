import React, { useState } from 'react';
import Layout from '../structure/Layout';
import styles from './SupportTicket.module.css';

const SupportTicket = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhoneNumber: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailMessage, setFailMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ticketData = {
      subject: formData.subject,
      description: formData.description,
      customerFirstName: formData.customerFirstName,
      customerLastName: formData.customerLastName,
      customerEmail: formData.customerEmail,
      customerPhoneNumber: formData.customerPhoneNumber,
    };

    const username = 'zaro';

    fetch(`http://localhost:8080/support-tickets/create/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Ticket submitted successfully');
          console.log(ticketData);
          setShowSuccessMessage(true);
          setFormData({
            subject: '',
            description: '',
            customerFirstName: '',
            customerLastName: '',
            customerEmail: '',
            customerPhoneNumber: '',
          });

          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 4000);
        } else {
          console.error('Ticket submission failed');
          setFailMessage(true);

          setTimeout(() => {
            setFailMessage(false);
          }, 4000);
          console.log(ticketData);
        }
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  return (
    // <Layout>
      <div className={styles['support-ticket-container']}>
        <h1>Support Ticket</h1>
        <div className={styles['paragraph-wrapper']}>
          <p>
            If you encountered any problems while using our website, please
            feel free to leave a support ticket and our colleagues will get in
            touch with you via the form email or phone number within 48 hours.
            Thank you for your cooperation!
          </p>
        </div>
        {showSuccessMessage && (
          <div className={styles['success-message']}>Ticket sent successfully!</div>
        )}
        {showFailMessage && (
          <div className={styles['fail-message']}>There was an error sending your ticket!</div>
        )}
        <form onSubmit={handleSubmit} className={styles['support-ticket-form']}>
          <div className={styles['form-row']}>
            <input
              type="text"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="Email"
              className={styles['email-input']}
            />
            <input
              type="text"
              name="customerFirstName"
              value={formData.customerFirstName}
              onChange={handleChange}
              placeholder="First Name"
              className={styles['name-input']}
            />
            <input
              type="text"
              name="customerLastName"
              value={formData.customerLastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={styles['name-input']}
            />
          </div>
          <div className={styles['form-row']}>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className={styles['subject-input']}
            />
            <input
              type="text"
              name="customerPhoneNumber"
              value={formData.customerPhoneNumber}
              onChange={handleChange}
              placeholder="Phone number"
              className={styles['phone-number-input']}
            />
          </div>
          <div className={styles['form-row']}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Problem Description"
              className={styles['description-input']}
            />
          </div>
          <div className={styles['form-row']}>
            <button type="submit" className={styles['submit-button']}>
              Submit
            </button>
          </div>
        </form>
      </div>
    // </Layout>
  );
};

export default SupportTicket;