const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI
  },
  function(accessToken: any, refreshToken: any, profile: any, cb: any) {
    console.log(profile);
    return cb(null, profile)
  }
));

passport.serializeUser((user: any, done: any) => {
    return done(null, user)
})

passport.deserializeUser((user: any, done: any) => {
    return done(null, user)
})

module.exports = passport;