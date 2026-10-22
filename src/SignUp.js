
import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert(`Account created for ${formData.username}`);
  }

  function handleGoogleSignup() {
    alert("Google sign-up will be connected later.");
  }

  return (
    <main className="signin-page">
      <section className="signin-card signup-card">
        <h1>Create Account</h1>
        <p className="signin-subtitle">
          Sign up for your KineticKrew account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <div className="name-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="name-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Create a username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="signin-button" type="submit">
            Sign Up
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          className="google-button"
          type="button"
          onClick={handleGoogleSignup}
        >
          Sign Up with Google
        </button>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/signin">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default SignUp;