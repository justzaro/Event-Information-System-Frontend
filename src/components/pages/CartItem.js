// CartItem.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getUsernameFromToken, } from '../utility/AuthUtils';

const CartItem = ({ data, onDelete, onUpdate }) => {
  const { eventName, eventLocation, ticketQuantity, ticketPrice, totalPrice, id } = data;

  const handleRemove = () => {
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken) {
      // Make a DELETE request to remove the cart item
      fetch(`http://localhost:8080/cart/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            // If the item is successfully removed, trigger the onDelete callback
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

  const handleIncrease = () => {

    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    const cartItem = {
      eventName: eventName,
      username: username,
      ticketQuantity: 1,
    };

    if (username && jwtToken) {
      // Make a DELETE request to remove the cart item
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
            // If the item is successfully removed, trigger the onDelete callback
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
      // If ticketQuantity is 1, call handleRemove to remove the item
      handleRemove();
    } else {
      // If ticketQuantity is greater than 1, decrement it by 1
      data.ticketQuantity = ticketQuantity - 1;
      // window.location.reload();
      console.log(data.ticketQuantity);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-column">
        <img src={`http://localhost:8080/events/event-picture/${eventName}`} className="item-image" alt={eventName} />
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
        </div>
      </div>
    </div>
  );
};

export default CartItem;
