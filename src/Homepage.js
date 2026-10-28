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
  const [profileOpen, setProfileOpen] = useState(false);
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
        <nav className="homepage-sidebar-navi">
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

        {/* Top Navigation Bar */}
        <header className="homepage-topbar">

          {/* Search Bar */}
          <div className="homepage-search">
            <input
              type="text"
              placeholder="Search workouts..."
              aria-label="Search workouts"
            />
          </div>

          {/* Right Side */}
          <div className="homepage-topbar-right">

            {/* Notification Bell */}
            <span className="homepage-notification" aria-label="Notifications">
              🔔
            </span>

            {/* Profile Dropdown */}
            <div className="homepage-profile">

              <button
              type="button"
              className="homepage-profile-button"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              >
                👤
              </button>

              {profileOpen && (
                <div className="homepage-profile-dropdown">
                 <Link to="/homepage">My Profile</Link>
                 <a href="#settings">Settings</a>
                 <Link to="/SignIn">Log Out</Link>
                </div>
             )}

            </div>
          </div>
        </header>

       {/* Welcome Section */}
       <section className="homepage-welcome">
         <h1>Welcome Back! 💪</h1>
         <p>Ready to crush your fitness goals today?</p>
       </section>

      </main>

  </div>
  );
}

export default Homepage;
