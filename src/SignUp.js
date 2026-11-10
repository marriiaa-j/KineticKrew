
import { useState } from "react";
import { Link, useNavigate, useSearchParams} from "react-router-dom";
import "./SignIn.css";

function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleError = searchParams.get("error");
  const [error, setError] = useState("");
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

 async function handleSubmit(event) {
    event.preventDefault();
    setError("");

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