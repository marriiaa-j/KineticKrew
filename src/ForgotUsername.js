import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignIn.css";

function ForgotUsername() {
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Your username would be sent to ${email}`);
  }

  return (
    <main className="signin-page">
      <section className="signin-card">
        <h1>Forgot Username?</h1>

        <p className="signin-subtitle">
          Enter your email address to recover your username.
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
            Recover Username
          </button>
        </form>

        <p className="signup-text">
          Remember your username?{" "}
          <Link to="/signin">Back to Sign In</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotUsername;