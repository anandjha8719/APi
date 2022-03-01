const express = require('express');
const env = require('./config/environment');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 8000;
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportJWT = require('./config/passport-jwt-strategy');

const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

app.use(express.urlencoded());

app.use(session({
    name: 'socialclub',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
