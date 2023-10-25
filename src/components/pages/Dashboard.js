import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGears, faPerson, faCalendarDays, faEnvelope, faTag } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';
import CreateEvent from './dashboard/CreateEvent';
import EventStatistics from './dashboard/EventStatistics';
import EventsOverview from './dashboard/EventsOverview';
import ModifyEvent from './dashboard/ModifyEvent';
import ManageUsers from './dashboard/ManageUsers';

const Dashboard = () => {

  const [selectedSection, setSelectedSection] = useState('Dashboard');

  const renderSection = () => {
    switch (selectedSection) {
      case 'ManageUsers':
        return <ManageUsers />;
      case 'EventsOverview':
        return <EventsOverview />;
      case 'EventStatistics':
        return <EventStatistics />;
      case 'CreateEvent':
          return <CreateEvent />;
      case 'ModifyEvent':
          return <ModifyEvent />;
      default:
        return null;
    }
  };

    return (
      <div className="dashboard-container">
        <div className="dashboard-menu">
          <div className="dashboard-menu-item">
            <FontAwesomeIcon icon={faGears} />
            <span>Dashboard</span>
          </div>

          <div className="dashboard-menu-hr">
            <hr />
         </div>

          <div className="dashboard-menu-item">
            <FontAwesomeIcon icon={faPerson} className="users-icon"/>
            <span className="users-text">Users</span>
          </div>

          <div 
            className="dashboard-menu-subitem"
            onClick={() => setSelectedSection('ManageUsers')}
          >
            Manage Profiles
          </div>

          <div className="dashboard-menu-hr">
            <hr />
         </div>

          <div className="dashboard-menu-item">
          <FontAwesomeIcon icon={faCalendarDays} className="events-icon"/>
            <span className="events-text">Events</span>
          </div>

          <div
             className="dashboard-menu-subitem"
             onClick={() => setSelectedSection('EventsOverview')}
          >
            Overview
          </div>

          <br />
          <div

            className="dashboard-menu-subitem"
             onClick={() => setSelectedSection('EventStatistics')}
          >    
            Statistics
          </div>
          <div
            className="dashboard-menu-subitem"
            onClick={() => setSelectedSection('CreateEvent')}
          >
            Create Event</div>

          <div 
            className="dashboard-menu-subitem"
            onClick={() => setSelectedSection('ModifyEvent')}
          >
            Modify Event
          </div>

          <div className="dashboard-menu-hr">
            <hr />
         </div>

         <div className="dashboard-menu-item">
          <FontAwesomeIcon icon={faTag} className="support-tickets-icon" />
            <span className="support-tickets-text">Coupons</span>
          </div>

          <div className="dashboard-menu-subitem">View</div>
          <br />
          <div className="dashboard-menu-subitem">Generate</div>

          <div className="dashboard-menu-hr">
            <hr />
         </div>


          <div className="dashboard-menu-item">
          <FontAwesomeIcon icon={faEnvelope} className="support-tickets-icon" />
            <span className="support-tickets-text">Support Tickets</span>
          </div>

          <div className="dashboard-menu-subitem">View</div>

        </div>

        <div className="dashboard-content">
          {renderSection()}
        </div>

      </div>
    );
  };
  
  export default Dashboard;
  