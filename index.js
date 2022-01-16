const passport = require('passport');
const Strategy = require('passport-saml').Strategy;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const getenv = require('getenv');

const issuer =  getenv('SAML2_ISSUER');
const entryPoint = getenv('SAML2_SSO_ENTRYPOINT');
const cert = getenv('SAML2_CERT');

passport.use(
  new Strategy({
        issuer: issuer,
        path: '/login/callback',
        entryPoint: entryPoint,
        cert: cert
  },
  function(profile, done) {
    console.log(JSON.stringify(profile));
    if (!profile.email) {
      return done(new Error("Error: Configure your IdP to provide the email parameter"), null);
    }
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const protect = function(req, res, next) {
  console.log(req.isAuthenticated() ? 'Authenticated' : 'Not authenticated');
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', protect, function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get(
  '/login', 
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), 
  function(req, res) {
    res.redirect('/');
  }
);

app.post(
  '/login/callback', 
  bodyParser.urlencoded({ extended: false }),
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), 
  function(req, res) {
    res.redirect('/');
  }
);

let port = 3000;
app.listen(port);
console.log(`app listening on port ${port}`);
