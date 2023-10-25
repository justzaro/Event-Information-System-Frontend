import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Events from './components/pages/Events';
import Home from './components/pages/Home';
import SupportTicket from './components/pages/SupportTicket';
import NavigationBar from './components/structure/NavigationBar';
import LogIn from './components/pages/LogIn';
import Register from './components/pages/Register';
import CartItems from './components/pages/CartItems';
import EventDetail from './components/pages/EventDetail';
import FestivalDetails from './components/pages/FestivalDetails';
import MyOrders from './components/pages/MyOrders';
import OrderDetails from './components/pages/OrderDetails';
import PostsPage from './components/pages/PostsPage';
import ProfileSettings from './components/pages/ProfileSettings';
import Dashboard from './components/pages/Dashboard';
import Festivals from './components/pages/Festivals';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/festivals" element={<Festivals />} />
          <Route path="/support-tickets" element={<SupportTicket />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartItems />} />

          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/festivals/:eventId" element={<FestivalDetails />} />

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
