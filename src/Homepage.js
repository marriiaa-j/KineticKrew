import logo from './logo.svg';
import './App.css';
import './Homepage.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/*function Homepage() {
  return (
    <div className="App">
      <header className="App-header">
        <div>Home Page</div>

        <Link to={'/'}>main page</Link>
      </header>
    </div>
  );
}*/

function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
return (
  <div className="homepage-dashboard">

    {/* Hamburger button stays visible */}
    <button
      className="homepage-menu-button homepage-fixed-menu"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label="Toggle sidebar"
    >
      ☰
    </button>

    {/* Sidebar */}
    <aside className={`homepage-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>

      {/* Logo */}
      <div className="homepage-sidebar-header">
        {sidebarOpen && (
          <div className="homepage-logo">
            <span className="homepage-logo-kinetic">Kinetic</span>
            <span className="homepage-logo-krew">Krew</span>
          </div>
        )}
      </div>

        {/* Navigation links */}
        <nav className="homepage-sidebar-nav">
          <Link to="/homepage">Dashboard</Link>
          <a href="#workouts">Workouts</a>
          <a href="#progress">My Progress</a>
          <a href="#fitness">Fitness</a>
          <a href="#records">Personal Records</a>
          <a href="#community">Community</a>
        </nav>

        {/* Bottom navigation */}
        <div className="homepage-sidebar-bottom">
          <a href="#settings">Settings</a>
          <a href="#support">Support</a>
        </div>

      </aside>

      {/* Main dashboard content */}
      <main className="homepage-main">
        <h1>Welcome Back! 💪</h1>
        <p>Ready to crush your fitness goals today?</p>
      </main>

    </div>
  );
}

export default Homepage;
