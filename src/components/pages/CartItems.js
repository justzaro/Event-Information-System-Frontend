// CartItems.js
import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utility/AuthUtils';
import CartItem from './CartItem';
import './CartItems.css';

const CartItems = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const username = getUsernameFromToken();
    const jwtToken = localStorage.getItem('jwtToken');

    if (username && jwtToken) {
      fetch(`http://localhost:8080/cart/${username}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setCartItems(data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }
  }, []);

  const handleDelete = (itemToDelete) => {
    // Implement delete logic here and update the cartItems state accordingly
  };

  const handleUpdate = (itemToUpdate) => {
    // Implement update logic here and update the cartItems state accordingly
  };

  return (
    <div className="cart-items">
      <div className="cart-header">
        <div className="header-image">Image</div>
        <div className="header-name">Event Name</div>
        <div className="header-location">Location</div>
        <div className="header-quantity">Ticket Quantity</div>
        <div className="header-single-price">Ticket Single Price</div>
        <div className="header-total-price">Ticket Total Price</div>
        <div className="header-actions">Actions</div>
      </div>
      
      {cartItems.map((item, index) => (
        <CartItem key={index} data={item} onDelete={handleDelete} onUpdate={handleUpdate} />
      ))}
      <div className="promo-code-input">
            <input
              type="text"
              placeholder="Enter Promo Code"
              
              
            />
            <button >Apply</button>
          
        </div>
    </div>
  );
};

export default CartItems;
