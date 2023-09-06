// Layout.js

import React from 'react';
import NavigationBar from './NavigationBar'; // Import your Navbar component
import './Layout.css'; // Import the CSS for your layout

const Layout = ({ children }) => {
  return (
    <div>
      <NavigationBar /> {/* Include your fixed navigation bar */}
      <div className="page-content">{children}</div> {/* Page content goes here */}
    </div>
  );
};

export default Layout;
