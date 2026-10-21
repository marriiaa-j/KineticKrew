import { useState} from "react";
import {Link} from "react-router-dom";
import "./SignIn.css";

function SignIn() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [ password, setPassword] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        // updated for profile signin -CM 
        alert( `Signing in as ${emailOrUsername}`);
    }

    function handleGoogleLogin(){
       window.location.href = 'http://localhost:8000/auth/google';
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