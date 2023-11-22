// CartItemsCount.js
import { useState, useEffect } from 'react';

let cartItemsCount = 0;
const listeners = [];

export const getCartItemsCount = () => cartItemsCount;

export const setCartItemsCount = (value) => {
  cartItemsCount = value;
  listeners.forEach((listener) => listener(value));
};

export const useCartItemsCount = () => {
  const [value, setValue] = useState(getCartItemsCount());

  const listener = (newValue) => setValue(newValue);
  listeners.push(listener);

  useEffect(() => {
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return value; // Return the current value, not the entire hook function
};
