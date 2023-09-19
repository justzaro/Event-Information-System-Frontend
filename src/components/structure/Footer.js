import React from 'react';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <div className="footer-heading">ЗА TICKETSTATION</div>
        <ul className="footer-list">
          <li><a href="/">За нас</a></li>
          <li><a href="/">Контакти</a></li>
          <li><a href="/">+359883288053*</a></li>
          <li>*телефонът е активен в работно време: Понеделник - Петък от 09:00 до 18:00 ч.</li>
          <li><a href="/">info@ticketstation.bg</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <div className="footer-heading">УСЛОВИЯ ЗА ПОЛЗВАНЕ</div>
        <ul className="footer-list">
          <li><a href="/">Правила и условия за ползване</a></li>
          <li><a href="/">Политика за поверителност</a></li>
          <li><a href="/">Политика за кукита</a></li>
          <li><a href="/">ПАРТНЬОРСКИ КАСИ</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
