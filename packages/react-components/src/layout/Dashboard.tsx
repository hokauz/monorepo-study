import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Dashboard.scss';

function TopBar({ toggleSidebar, isSidebarOpen }: { toggleSidebar: () => void, isSidebarOpen: boolean}) {
  return (
    <div className="topbar">
      <button onClick={toggleSidebar}>
        {isSidebarOpen ? 'Retract' : 'Expand'}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="main-content">
        <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/banner">Banner</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/logout">Logout</Link></li>
              <li><Link to="/banner">Banner</Link></li>
            </ul>
          </nav>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;