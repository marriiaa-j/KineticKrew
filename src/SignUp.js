/**
 * @file SignUp.js
 * @module SignUp
 * @author Maria Jimenez(); Citlalli Martinez (auth integration & form sub DB)
 * @since 2026-10-20 
 *
 * @description
 * Sign-up page (React component) for KineticKrew. Lets users create an account
 * with email and password, or with Google. After a successful sign-up, the user
 * is logged in and taken to the questionnaire.
 *
 * **Important data structures**
 * - **`formData` object**: one state object holding every form field, keyed by
 *   each input's `name` attribute. A single generic `handleChange` updates any field.
 * - **URL query parameters** (`?error=...`): carry error codes from the backend's
 *   Google sign-up redirect back to this page.
 *
 * **Algorithms and why they were chosen**
 * - **Two-layer validation** (here and on the server): checking password length
 *   and matching passwords in the browser gives instant feedback, while the
 *   server repeats the checks because it is the real security boundary.
 * - **Controlled inputs with immutable updates** (`{ ...formData, [name]: value }`):
 *   creating a new object on each change lets React detect the change and
 *   re-render the live validation messages.
 */

import { useState } from "react";
import { Link, useNavigate, useSearchParams} from "react-router-dom";
import "./SignIn.css";

/**
 * Sign-up page component.
 *
 * - Manual sign-up sends the form to `POST /api/signup`. On success the user
 *   is logged in and redirected to `/questionnaire`; on failure the server's
 *   error message is shown at the top of the card.
 * - Google sign-up redirects to the backend's `/auth/google/signup` route.
 *   If Google sign-up fails, the backend sends the user back here with an
 *   `?error=` query parameter (`account_exists` or `email_exists`), which is
 *   shown as a message.
 *
 * @component
 * @returns {JSX.Element} The sign-up form.
 */
function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /** Error code returned by the Google sign-up flow, if any. */
  const googleError = searchParams.get("error");

  /** Error message shown at the top of the form. */
  const [error, setError] = useState("");

    /**
   * Values of every field in the form, keyed by each input's `name` attribute.
   * @type {[{firstName: string, lastName: string, email: string, username: string, password: string, confirmPassword: string}, Function]}
   */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

    /**
   * Updates the matching field in `formData` as the user types.
   * Works for every input because it uses the input's `name` attribute as the key.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input: the input's change event.
   * @returns {void} Output: none; updates `formData` state.
   */
  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

    /**
   * Validates the form, then sends it to the backend to create the account.
   * Checks that the password is at least 8 characters and that both password
   * fields match before sending. `credentials: "include"` lets the browser
   * store the login cookie the server sets.
   * @param {React.FormEvent<HTMLFormElement>} event - Input: the form's submit event.
   * @returns {Promise<void>} Output: navigates to `/questionnaire`;
   *   on failure, sets an error to display.
   */
 async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
    setError("Password must be at least 8 characters.");
    return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }
      navigate("/questionnaire");
    } catch (err) {
      setError("Could not reach the server. Is it running?");
    }
  }

    /**
   * Starts Google sign-up by sending the browser to the backend's Google route.
   * @returns {void} Output: browser redirect to `/auth/google/signup`.
   */
  function handleGoogleLogin(){
       window.location.href = 'http://localhost:4000/auth/google/signup';
    }

  return (
    <main className="signin-page">
      <section className="signin-card signup-card">
        <h1>Create Account</h1>
        <p className="signin-subtitle">
          Sign up for your KineticKrew account
        </p>

        {error && <p className="error-message">{error}</p>}

        {googleError === "account_exists" && (
          <p className="error-message">
            An account is already linked to this Google account.{" "}
            <Link to="/signin">Try signing in</Link>.
          </p>
        )}
        {googleError === "email_exists" && (
          <p className="error-message">
            An account with this email already exists.{" "}
            <Link to="/signin">Try signing in</Link>.
          </p>
        )}

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

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            />

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

          {formData.password !== "" && formData.password.length < 8 && (
              <p className="error-message">Password must be at least 8 characters.</p>
            )}

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

            {formData.confirmPassword !== "" && formData.password !== formData.confirmPassword && (
              <p className="error-message">Passwords do not match.</p>
            )}

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
          onClick={handleGoogleLogin}
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