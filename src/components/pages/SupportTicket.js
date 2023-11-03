import React, { useState } from 'react';
import styles from './SupportTicket.module.css';
import { getUsernameFromToken } from '../utility/AuthUtils';
import LoadingScreen from '../utility/LoadingScreen';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const ticketData = {
      subject: formData.subject,
      description: formData.description,
      customerFirstName: formData.customerFirstName,
      customerLastName: formData.customerLastName,
      customerEmail: formData.customerEmail,
      customerPhoneNumber: formData.customerPhoneNumber,
    };
  
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');
  
    try {
      setIsLoading(true); // Set isLoading to true before the fetch request
  
      const response = await fetch(`http://localhost:8080/support-tickets/${username}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
  
      if (response.ok) {
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
        setFailMessage(true);
  
        setTimeout(() => {
          setFailMessage(false);
        }, 4000);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false); // Ensure that isLoading is set to false, even in case of an error
    }
  };
  

  return (
    // <Layout>
      <div className={styles['support-ticket-container']}>

        <div className={styles['contact-section']}>
          <h2>Contact us</h2>
          <br />
          <p>Looking for contact with us or just want to send a support ticket?</p>
          <p>If you have any general issues or administrative questions,
            please free feel to contact us via phone or email. In case of
            a more in-depth question, you can always use your support ticket
            form and we will respond to your query as soon as possible. 
          </p>
          <div className={styles['contact-details']}>
            <p>Call us at: +1-123-456-7890 / +1-321-654-0987 </p>
            <p>Email: support@example.com</p>
          </div>
        </div>

        <div className={styles['vertical-dividing-line']}></div>

        <div className={styles['form-section']}>

          <h1>Support Ticket</h1>

          {showSuccessMessage && (
            <div className={styles['success-message']}>Ticket sent successfully!
            </div>
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
            <LoadingScreen isLoading={isLoading} />
          </form>
        </div>
      </div>
    // </Layout>
  );
};

export default SupportTicket;
