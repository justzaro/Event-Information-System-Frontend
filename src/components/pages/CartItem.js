// CartItem.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import { getUsernameFromToken, } from '../utility/AuthUtils';
import { useNavigate } from 'react-router-dom';


const CartItem = ({ data, onDelete, onUpdate }) => {
  const { eventName, eventLocation, ticketQuantity, ticketPrice, totalPrice, id, eventId } = data;
  const navigate = useNavigate();

  const handleRemove = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken) {
      fetch(`http://localhost:8080/cart/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Failed to remove cart item.');
          }
        })
        .catch((error) => {
          console.error('Error removing cart item:', error);
        });
    }
  };

  const handleViewEvent = () => {
    console.log(data);
    navigate(`/event/${eventId}`);
  };

  const handleIncrease = () => {

    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    const cartItem = {
      eventName: eventName,
      username: username,
      ticketQuantity: 1,
    };

    if (username && jwtToken) {
      fetch(`http://localhost:8080/cart`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Failed to remove cart item.');
          }
        })
        .catch((error) => {
          console.error('Error removing cart item:', error);
        });
    }
  };

  const handleDecrease = () => {
    if (ticketQuantity === 1) {
      handleRemove();
    }

    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    const cartItem = {
      eventName: eventName,
      username: username,
      ticketQuantity: ticketQuantity,
    };

    if (username && jwtToken) {
      fetch(`http://localhost:8080/cart/decrease`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      })
        .then((response) => {
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Failed to remove cart item.');
          }
        })
        .catch((error) => {
          console.error('Error removing cart item:', error);
        });
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-column">
        <a href={`/concerts/${eventId}`}>
          <img src={`http://localhost:8080/events/event-picture/${eventId}`} className="item-image" alt={eventName} />
        </a>
      </div>
      <div className="cart-column">
        <div className="item-name">{eventName}</div>
      </div>
      <div className="cart-column">
        <div className="item-location">{eventLocation}</div>
      </div>
      <div className="cart-column">
        <div className="item-quantity">{ticketQuantity}</div>
      </div>
      <div className="cart-column">
        <div className="item-price">{ticketPrice.toFixed(2)} лв.</div>
      </div>
      <div className="cart-column">
        <div className="item-total">{totalPrice.toFixed(2)} лв.</div>
      </div>
      <div className="cart-column">
      <div className="item-actions">
          <button 
           onClick={handleIncrease}
           className="increase-button" 
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button 
           onClick={handleDecrease}
           className="decrease-button"
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <button
           onClick={handleRemove}
           className="remove-button"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <button
           onClick={handleViewEvent}
           className="view-event"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
