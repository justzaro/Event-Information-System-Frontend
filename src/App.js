import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Users from './components/pages/Users';
import Events from './components/pages/Events';
import Home from './components/pages/Home';
import SupportTicket from './components/pages/SupportTicket';
import NavigationBar from './components/structure/NavigationBar';
import LogIn from './components/pages/LogIn';
import Register from './components/pages/Register';
import CartItems from './components/pages/CartItems';
import EventDetail from './components/pages/EventDetail';
import MyOrders from './components/pages/MyOrders';
import OrderDetails from './components/pages/OrderDetails';
import PostsPage from './components/pages/PostsPage';
import ProfileSettings from './components/pages/ProfileSettings';
import Dashboard from './components/pages/Dashboard';
import CreateEvent from './components/pages/dashboard/CreateEvent';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/events" element={<Events />} />
          <Route path="/support-tickets" element={<SupportTicket />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartItems />} />
          <Route path="/event/:eventId" element={<EventDetail />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostsPage />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <NavigationBar />
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
