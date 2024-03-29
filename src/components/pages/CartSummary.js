import React from 'react';
import './CartSummary.css';

const CartSummary = ({ cartItems, couponResult }) => {
    const totalValue = cartItems.reduce((total, item) => total + item.totalPrice, 0);
    const priceToPay = totalValue - couponResult;

    return (
        <div className="cart-summary-container">
            <div className="cart-summary-total-value">
                <p>Total Value: {totalValue !== null ? totalValue.toFixed(2) + ' лв.' : 'Total Value: 0.00 лв.'}</p>            </div>

            <div className="cart-summary-coupon-discount">
                <p>
                    {couponResult !== null ? `Coupon Discount: ${couponResult.toFixed(2)} лв.` : 'Coupon Discount: 0.00 лв.'}
                </p>
            </div>

            <div className="cart-summary-price-to-pay">
                <p>
                    {priceToPay !== null ? `Price to Pay: ${priceToPay.toFixed(2)} лв.` : 'Price to Pay: 0.00 лв.'}
                </p>
            </div>

        </div>
    );
};

export default CartSummary;
