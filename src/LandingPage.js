import './LandingPage.css';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page" id="home">

      <nav className="landing-navibar">

        <div className="landing-name">
          <Link to="/landingpage">
            <span className="name-kinetic">Kinetic</span>
            <span className="name-krew">Krew</span>
          </Link>
        </div>

        <div className="landing-navi-links">
          <a href="#home">Home</a>
          <a href="#workouts">Workouts</a>
          <a href="#features">Features</a>
          <a href="#community">Community</a>
          <a href="#about">About Us</a>
        </div>

        <div className="landing-auth-buttons">
          <Link to="/SignIn" className="landing-signin-button">
            Sign In
          </Link>

          <Link to="/signup" className="landing-signup-button">
            Sign Up
          </Link>
        </div>

      </nav>

      <section className="landing-hero">

        <div className="landing-hero-content">
          <h1>
            Your Fitness Journey
            <span> Starts Here.</span>
          </h1>

          <p>
            Achieve your fitness goals with personalized workouts,
            progress tracking, and a community that keeps you motivated.
          </p>

          <Link to="/signup" className="landing-getstarted-button">
            Get Started →
          </Link>
        </div>

        <div className="landing-hero-image">
          {/* Fitness image will go here */}
        </div>

      </section>

      <section id="workouts" className="landing-section">
        <h2>Explore Workouts</h2>
        <p>
          Discover workouts designed to help you build strength,
          improve endurance, and stay active.
        </p>
      </section>

      <section id="features" className="landing-section">
        <h2>Our Features</h2>
        <p>
          Track your progress, set fitness goals, and explore
          personalized workout recommendations.
        </p>
      </section>

      <section id="community" className="landing-section">
        <h2>Join Our Community</h2>
        <p>
          Stay motivated, connect with others, and work toward
          your fitness goals together.
        </p>
      </section>

      <section id="about" className="landing-section">
        <h2>About KineticKrew</h2>
        <p>
          KineticKrew is a fitness tracking platform designed
          to make your fitness journey easier and more enjoyable.
        </p>
      </section>

      <footer className="landing-footer">
        <p>© 2026 KineticKrew. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default LandingPage;