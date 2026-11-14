/**
 * @file SignIn.js
 * @module SignIn
 * @author Maria Jimenez(); Citlalli Martinez(Manual sign in function)
 * @date 2026-10-03
 *
 * @description
 * Sign-in page (React component) for KineticKrew. Google sign-in is connected
 * to the backend; the email/username and password form is a placeholder until
 * manual sign-in is implemented.
 *
 * **Important data structures**
 * - **`emailOrUsername` and `password` state strings**: controlled input values
 *   for the sign-in form.
 *
 * **Algorithms and why they were chosen**
 * - **Full-page redirect for Google sign-in** (`window.location.href`) instead of a
 *   popup or `fetch`: OAuth 2.0 requires the browser itself to visit Google and
 *   come back, so the backend can set the login cookie on its own domain.
 */

import { useState} from "react";
import {Link} from "react-router-dom";
import "./SignIn.css";

/**
 * Sign-in page component.
 * @component
 * @returns {JSX.Element} The sign-in form with a Google sign-in button.
 */
function SignIn() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [ password, setPassword] = useState("");

      /**
   * Handles the email/username and password form.
   * Placeholder: shows an alert until manual sign-in is connected to the backend.
   *  Input: the form's submit event.
   * @returns Output: an alert naming the user.
   */
    function handleSubmit(event) {
        event.preventDefault();

        // updated for profile sign-in -CM 
        alert( `Signing in as ${emailOrUsername}`);
    }

      /**
   * Starts Google sign-in by sending the browser to the backend's Google route.
   * Input: none.
   * @returns {void} Output: browser redirect to `/auth/google`.
   */
    function handleGoogleLogin(){
       window.location.href = 'http://localhost:4000/auth/google/';
    }
    return ( 
        <main className="sign-page">
            <section className="signin-card">
                <h1>Welcome Back!</h1>
                <p className= "signin-card_subtitle">Sign in to your KineticKrew account</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="emailOrUsername">Email or Username</label>
                    <input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Enter your email or username"
                    value={emailOrUsername}
                    onChange={(event)=> setEmailOrUsername(event.target.value)}
                    required
                    />

                    <div className="password-label-row">
                        <label htmlFor="password" > Password </label>
                        <Link to="/forgot-password"> Forgot Password?</Link>
                        </div>

                        <input
                        id="password"
                        type="password"
                        placeholder= " Enter your password"
                        value={password}
                        onChange={(event)=> setPassword(event.target.value)}
                        required
                        />
                        <button className="signin-button" type="submit">
                            Sign In
                            </button>
                </form>
                <div className="divider">
                    <span> or </span>
                </div>

                <button className="google-button" type="button" onClick={handleGoogleLogin}>
                    Sign in with Google
                </button>

                <p className="forgot-username">
                    Forgot your username{""}
                    <Link to= "/forgot-username" > Recover it here </Link>
                    </p>

                <p className="signup-text">
                    Don&apos;t have an account? {" "}
                <Link to="/signup">Sign up here</Link>
             </p> 
            </section>
        </main>
    );
}
export default SignIn;