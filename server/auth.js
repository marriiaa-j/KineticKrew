/**
 * @file auth.js
 * @module auth
 * @author Citlalli Martinez
 * @date 2026-10-03
 * @description
 * Authentication module for the KineticKrew backend. Exports a single setup
 * function that plugs sessions, Google OAuth 2.0 sign-in/sign-up, manual
 * email/password sign-up, and helper routes into the main Express app
 * (server/index.js).
 *
 * **Important data structures**
 * - **Session store** (express-session, in-memory key-value map): maps a session ID
 *   (kept in the browser's signed cookie) to session data. Holds `authMode`
 *   ("signin" | "signup") during the Google redirect, and the logged-in user's ID.
 * - **`users` table** (MySQL): one row per account. `google_id`, `email`, and
 *   `username` are UNIQUE indexes, so lookups by any of them are fast and duplicates
 *   are rejected by the database itself.
 * - **SessionUser object** `{ id, email, display_name }`: the shape of `req.user`
 *   that every other route relies on, regardless of how the user signed up.
 *
 * **Algorithms and why they were chosen**
 * - **OAuth 2.0 Authorization Code flow** (via Passport) instead of a front-end-only
 *   (implicit) flow: the Google client secret stays on the server and never reaches
 *   the browser.
 * - **bcrypt password hashing (cost factor 10)** instead of a fast hash such as
 *   SHA-256 or MD5: bcrypt is salted and deliberately slow, which makes brute-force
 *   and rainbow-table attacks impractical if the database is ever exposed.
 * - **Server-side sessions** instead of JSON Web Tokens: simpler to implement,
 *   and logging out or deleting a user takes effect immediately.
 * - **Serialize only the user ID** into the session and reload the user on each
 *   request: keeps the cookie small and always reflects current database data.
 * - **Parameterized SQL queries (`?` placeholders)** instead of string concatenation:
 *   prevents SQL injection.
 */
 

const passport = require('passport');
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const bcrypt =require('bcryptjs');

/**
 * Base URL of the React front end. Users are redirected here after
 * authentication succeeds or fails.
 * @constant {string}
 */
const CLIENT_URL = 'http://localhost:3000';

/**
 * A user as stored in the session and exposed to routes as `req.user`.
 * @typedef {Object} SessionUser
 * @property {number} id - Primary key from the `users` table.
 * @property {?string} email - The user's email address.
 * @property {?string} display_name - Name shown in the app.
 */
 
/**
 * Registers sessions, Passport, and all authentication routes on the given app.
 * Must be called after `express.json()` and before any route that reads `req.user`.
 *
 * Routes added:
 * - `GET  /auth/google`          Start Google sign-in.
 * - `GET  /auth/google/signup`   Start Google sign-up.
 * - `GET  /auth/google/callback` Google's redirect target for both flows.
 * - `POST /api/signup`           Create an account with email and password.
 * - `GET  /api/me`               Return the logged-in user.
 * - `GET  /logout`               End the session.
 *
 * @param {import('express').Express} app - The Express application to extend.
 * @returns {void}
 *
 * @example
 * const setupAuth = require('./auth');
 * app.use(express.json());
 * setupAuth(app);
 */

module.exports = function setupAuth(app){
    // Session cookie: keeps users logged in between requests.
  // SESSION_SECRET signs the cookie so it can't be forged.

app.use(
    session({
    secret: process.env.SESSION_SECRET || 'dev-secret', //gives user browser a cookie for session ID
    resave: false,
    saveUninitialized:false,
})
);

app.use(passport.initialize());
app.use(passport.session());

  /**
   * Google OAuth verify callback. Runs after Google confirms the user's identity.
   * Behavior depends on `req.session.authMode`, which the starting route sets:
   * - `"signup"`: creates a new user, unless the Google account or its email is already registered.
   * - `"signin"`: logs in an existing user, or fails if no account is linked to this Google account.
   *
   * @function googleVerifyCallback
   * @memberof module:auth
   * @param {Object} req - Input: the incoming Express request (available because of `passReqToCallback`).
   * @param {string} accessToken - Input: Google access token (not used).
   * @param {string} refreshToken - Input: Google refresh token (not used).
   * @param {Object} profile - Input: the user's Google profile (`id`, `displayName`, `emails`).
   * @param {Function} done - Input: Passport callback, called as `done(err, user, info)`.
   * @returns {Promise<void>} Output (through `done`): a {@link SessionUser} on success, or
   *   `false` plus `info.reason` = `"account_exists"`, `"email_exists"`, or `"no_account"` on failure.
   */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'http://localhost:4000/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) =>{
   try{
    const mode = req.session.authMode || 'signin'; 
    const email = profile.emails?.[0]?.value;

    //Read DB for user acct with Google ID
    const[rows]= await db.query('SELECT * FROM users WHERE google_id =?', [profile.id]);
    const existing = rows[0];

    //Check if acct exists when signing up
    if(mode ==='signup'){
        if(existing) return done(null, false, {reason: 'account_exists'});

         // Block sign-up if the email is already used by another account
        if(email){
            const [emailRows] = await db.query('SELECT id FROM users WHERE email =?',[email]);
            if(emailRows.length) return done(null, false, {reason: 'email_exists'});
        }
        const [result] = await db.query(
            'INSERT INTO users (google_id, email, display_name) VALUES (?,?,?)',
            [profile.id, email, profile.displayName]
        );
        return done(null, {id:result.insertId,email, displayName: profile.displayName});
    }

    // Sign in
    if (!existing) return done (null, false, {reason: 'no_account_found'});
    return done(null, existing);
   } catch (err) {
    return done(err);
   }
}
)
);

  /**
   * Stores only the user's ID in the session cookie.
   * @param {SessionUser} user - The logged-in user.
   * @param {Function} done - Callback: `done(err, id)`.
   */

passport.serializeUser((user,done)=>done(null,user.id));
  /**
   * Loads the full user from the database on each request, using the ID in the session.
   * The result becomes `req.user`. Returns `false` if the user no longer exists.
   * @param {number} id - User ID from the session.
   * @param {Function} done - Callback: `done(err, user)`.
   * @returns {Promise<void>}
   */

passport.deserializeUser(async(id, done)=> {
    try {
        const [rows] = await db.query('SELECT id,email, display_name FROM users WHERE id = ?', [id]);
        done(null, rows[0] || false);
    } catch (err){
        done(err);
    }
});

//Manual sign-up 
  /**
   * POST /api/signup
   * Creates an account with email and password, then logs the user in.
   * The password is hashed with bcrypt; the plain password is never stored.
   *
   * Request body (JSON):
   * @param {string} req.body.firstName - First name (combined into display_name).
   * @param {string} req.body.lastName - Last name (combined into display_name).
   * @param {string} req.body.email - Email address (stored lowercase, must be unique).
   * @param {string} req.body.username - Username, 15 characters max, must be unique.
   * @param {string} req.body.password - Password, at least 8 characters.
   *
   * Responses:
   * - `201` The new {@link SessionUser}; the user is now logged in.
   * - `400` A required field is missing or invalid.
   * - `409` The email or username is already in use.
   */

app.post('/api/signup', async (req,res, next)=> {
    const firstName = (req.body?.firstName || '').trim();
    const lastName = (req.body?.lastName || '').trim();
    const email = (req.body?.email || '').trim().toLowerCase();
    const username = (req.body?.username || '').trim();
    const password = req.body?.password || '';

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }
    if (username.length > 15) {
      return res.status(400).json({ error: 'Username must be 15 characters or fewer' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
      const [existing] = await db.query(
        'SELECT email, username FROM users WHERE email = ? OR username = ?',
        [email, username]
      );
      if (existing.some((u) => u.email === email)) {
        return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });
      }
      if (existing.length) {
        return res.status(409).json({ error: 'That username is taken' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const displayName = `${firstName} ${lastName}`.trim() || username;

      const [result] = await db.query(
        'INSERT INTO users (email, username, password_hash, display_name) VALUES (?, ?, ?, ?)',
        [email, username, passwordHash, displayName]
      );

      // Log them in right away, same as Google sign-up
      const user = { id: result.insertId, email, display_name: displayName };
      req.logIn(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'That email or username is already in use' });
      }
      next(err);
    }
  });
  
//Sign in with google
  /**
   * GET /auth/google
   * Starts Google sign-in. Marks the session as a sign-in attempt and
   * redirects the browser to Google's account picker.
   */

app.get("/auth/google", (req,res,next)=> {
    req.session.authMode = 'signin';
    passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'})(req,res,next);
});

//signup with google 
  /**
   * GET /auth/google/signup
   * Starts Google sign-up. Marks the session as a sign-up attempt and
   * redirects the browser to Google's account picker.
   */

app.get("/auth/google/signup",(req,res,next) =>{
      req.session.authMode = 'signup';
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
  });
  
  /**
   * GET /api/me
   * Returns the logged-in user so the front end can check who is signed in.
   * Responses: `200` {@link SessionUser}, or `401` if no one is logged in.
   */
app.get('/api/me', (req,res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    res.json(req.user);
});

  // Callback url (shared by sign in and sign up)
    /**
   * GET /auth/google/callback
   * Google redirects here after the user picks an account (both flows).
   * - Success, sign-up: logs the user in and redirects to `/questionnaire`.
   * - Success, sign-in: logs the user in and redirects to the home page.
   * - Failure: redirects to `/signup` or `/signin` with `?error=<reason>`.
   */

  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      const mode = req.session.authMode;
      delete req.session.authMode;
      if (err) return next(err);

      if (!user) {
        const page = mode === 'signup' ? 'signup' : 'signin';
        return res.redirect(`${CLIENT_URL}/${page}?error=${info?.reason || 'failed'}`);
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        // New users go to the questionnaire; returning user go home
        res.redirect(mode === 'signup' ? `${CLIENT_URL}/questionnaire` : CLIENT_URL);
      });
    })(req, res, next);
  });

//logout route
  /**
   * GET /logout
   * Ends the session and redirects to the front end's home page.
   */

app.get("/logout", (req,res, next) => {
    //callback 
    req.logOut((err)=>{
        if (err) return next(err);
         res.redirect("/");
    });
});
};