const passport = require('passport');
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const bcrypt =require('bcryptjs');
const CLIENT_URL = 'http://localhost:3000';

module.exports = function setupAuth(app){
app.use(
    session({
    secret: process.env.SESSION_SECRET || 'dev-secret', //gives user browser a cookie for session ID
    resave: false,
    saveUninitialized:false,
})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'http://localhost:4000/auth/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) =>{
   try{
    const mode = req.session.authMode || 'signin'; 
    const email = profile.emails?.[0]?.value;

    //Read DB for user acct
    const[rows]= await db.query('SELECT * FROM users WHERE google_id =?', [profile.id]);
    const existing = rows[0];

    //Check if acct exists when signing up
    if(mode ==='signup'){
        if(existing) return done(null, false, {reason: 'account_exists'});
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

    if (!existing) return done (null, false, {reason: 'no_account_found'});
    return done(null, existing);
   } catch (err) {
    return done(err);
   }
}
)
);

passport.serializeUser((user,done)=>done(null,user.id));
passport.deserializeUser(async(id, done)=> {
    try {
        const [rows] = await db.query('SELECT id,email, display_name FROM users WHERE id = ?', [id]);
        done(null, rows[0] || false);
    } catch (err){
        done(err);
    }
});

//Manual sign-up 
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
app.get("/auth/google", (req,res,next)=> {
    req.session.authMode = 'signin';
    passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'})(req,res,next);
});

//signup with google 
app.get("/auth/google/signup",(req,res,next) =>{
      req.session.authMode = 'signup';
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
  });
  
//Callback url route to check who is logged in
app.get('/api/me', (req,res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    res.json(req.user);
});

  // Callback url (shared by sign in and sign up)
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
        // New users go to the questionnaire; returning go home
        res.redirect(mode === 'signup' ? `${CLIENT_URL}/questionnaire` : CLIENT_URL);
      });
    })(req, res, next);
  });

//logout route
app.get("/logout", (req,res, next) => {
    //callback 
    req.logOut((err)=>{
        if (err) return next(err);
         res.redirect("/");
    });
});
};