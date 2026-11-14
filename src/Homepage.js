import {
  House,
  Dumbbell,
  ChartNoAxesColumn,
  Heart,
  Trophy,
  UsersRound,
  Settings,
  CircleHelp,
  Search,
  Bell,
  UserRound,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';
import logo from './logo.svg';
import './App.css';
import './Homepage.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * @file Homepage.js
 * @description Frontend homepage dashboard for the KineticKrew
 * fitness tracking website. Provides sidebar navigation,
 * a workout search interface, notification display,
 * profile dropdown, and welcome section.
 *
 * @author May
 * @date 2026-11-13
 */

/**
 * Homepage component for the KineticKrew fitness tracking system.
 *
 * Displays the main dashboard interface and allows users to
 * interact with the sidebar, search bar, and profile menu.
 *
 * React state variables:
 * - sidebarOpen: Controls sidebar visibility.
 * - profileOpen: Controls profile dropdown visibility.
 * - searchQuery: Stores the user's search input.
 * - searchMessage: Stores the search feedback message.
 * - notificationOpen: Reserved for notification dropdown state.
 *
 * @component
 * @returns {React.JSX.Element} The homepage dashboard interface.
 */

function Homepage() {
  // Controls whether the sidebar is expanded or collapsed.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Controls whether the profile dropdown is displayed.
  const [profileOpen, setProfileOpen] = useState(false);

   // Stores the text entered in the search bar.
  const [searchQuery, setSearchQuery] = useState('');

  // Stores the message displayed after a search.
  const [searchMessage, setSearchMessage] = useState('');

  // Reserved for controlling notification dropdown visibility.
  const [notificationOpen, setNotificationOpen] = useState(false);

  /**
   * Handles the submission of the workout search form.
   *
   * Prevents the default form submission, removes extra
   * whitespace from the search query, and displays a
   * search feedback message.
   *
   * If the search input is empty, the message is cleared.
   *
   * @function handleSearch
   * @param {React.FormEvent<HTMLFormElement>} e
   * The form submission event.
   * @returns {void}
   */
  function handleSearch(e) {
   e.preventDefault();

   const query = searchQuery.trim();

   if (!query) {
     setSearchMessage('');
     return;
   }

   setSearchMessage(`Searching for: ${query}`);
   console.log("Searching for:", query);
  }

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
          <Link to="/homepage" className="homepage-navi-link active">
            <House size={22} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <a href="#workouts" className="homepage-navi-link">
            <Dumbbell size={22} />
            {sidebarOpen && <span>Workouts</span>}
          </a>

          <a href="#progress" className="homepage-navi-link">
            <ChartNoAxesColumn size={22} />
            {sidebarOpen && <span>My Progress</span>}
          </a>

          <a href="#fitness" className="homepage-navi-link">
            <Heart size={22} />
            {sidebarOpen && <span>Fitness</span>}
          </a>

          <a href="#records" className="homepage-navi-link">
            <Trophy size={22} />
            {sidebarOpen && <span>Personal Records</span>}
          </a>

          <a href="#community" className="homepage-navi-link">
            <UsersRound size={22} />
            {sidebarOpen && <span>Community</span>}
          </a>
        </nav>

        {/* Bottom navigation */}
        <div className="homepage-sidebar-bottom">
          <a href="#settings" className="homepage-navi-link">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </a>

          <a href="#support" className="homepage-navi-link">
            <CircleHelp size={22} />
            {sidebarOpen && <span>Support</span>}
          </a>
        </div>

    </aside>

      {/* Main dashboard content */}
      <main className="homepage-main">

        {/* Top Navigation Bar */}
        <header className="homepage-topbar">

          {/* Search Bar */}
          <form className="homepage-search" onSubmit={handleSearch}>
            <input
             type="text"
             placeholder="Search workouts..."
             aria-label="Search workouts"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
             type="submit"
             className="homepage-search-button"
             aria-label="Search"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Right Side */}
          <div className="homepage-topbar-right">

            {/* Notification Bell */}
            <div className="homepage-notification">

              <button
                type="button"
                className="homepage-notification-button"
                onClick={() => setNotificationOpen(!notificationOpen)}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
              >
                <Bell size={22} />
              </button>

              {notificationOpen && (
                <div className="homepage-notification-dropdown">
                  <div className="homepage-notification-header">
                    <h3>Notifications</h3>
                    <Bell size={18} />
                  </div>

                  <p>No new notifications yet.</p>
                </div>
              )}
            </div>

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
      {searchMessage && (
        <p className="homepage-search-message">
          {searchMessage}
        </p>
      )}

      </main>

  </div>
  );
}

export default Homepage;
