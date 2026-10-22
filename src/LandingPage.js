import './LandingPage.css';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to KineticKrew!</h1>
        <p>Your fitness journey starts here.</p>

        <Link to="/Signin">Sign In</Link>
        <br />
        <Link to="/Signup">Sign Up</Link>
      </header>
    </div>
  );
}

export default LandingPage;