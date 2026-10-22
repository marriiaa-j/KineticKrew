import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    alert(`A password reset link would be sent to ${email}`);
  }

  return (
    <main className="signin-page">
      <section className="signin-card">
        <h1>Forgot Password?</h1>

        <p className="signin-subtitle">
          Enter your email address and we will help you reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button className="signin-button" type="submit">
            Send Reset Link
          </button>
        </form>

        <p className="signup-text">
          Remember your password?{" "}
          <Link to="/signin">Back to Sign In</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;