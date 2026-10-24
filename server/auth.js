require('dotenv').config();

const express = require('express');
const passport = require('passport');
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const app = express();

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
}, async (accessToken, refreshToken, profile, done) =>{
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

//endpoints - Stopped here 10/22
app.get("/auth/google", (req,res,next)=> {
    req.session.authMode = 'signin';
    passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'})(req,res,next);
});

app.get("/auth/google/callback",(req,res,next) =>{
    passport.authenticate('google',(err,user,info) => {
        const mode =req.session.authMode;
        delete req.session.authMode;
        if(err) return next(err);

        if (!user) {
            const page = mode === 'signup' ? 'signup': 'signin';
            return res.redirect(`${CLIENT_URL}/${page}?error=${info?.reason || 'failed'}`);
        }
        req.logIn(user, (err) =>{
            if (err) return next(err);
            // New users go to the questionnaire; returning go home
            res.redirect(mode === 'signup' ?`${CLIENT_URL}/questionnaire` : CLIENT_URL);
    });
}); (req,res,next);
});

//route to check who is logged in
app.get('/api/me', (req,res) => {
    if (!req.user) return res.status(401).json({ error: 'Not logged in' });
    res.json(req.user);
});

//callback url
app.get("/auth/google/callback", passport.authenticate('google', {failureRedirect: "/"}), (req,res) =>{
    res.redirect('/profile')
})

app.get("/profile",(req, res)=>{
    if (!req.user) return res.redirect('/');
    res.send(`Welcome ${req.user.displayName}`);
});

//logout route
app.get("/logout", (req,res, next) => {
    //callback 
    req.logOut((err)=>{
        if (err) return next(err);
         res.redirect("/");
    });
});

app.listen(8000,()=>{
    console.log('Server is running at port 80000');
});