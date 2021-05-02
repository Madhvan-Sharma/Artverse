const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const path = require('path');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/moongoose');


const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);

// data parser
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// making static files accessible
app.use(express.static('./assets'));



// extract style and scripts from sub pages into the layout
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// setting up Views engine as ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(session({
    name : 'ArtGallery',
    secret : 'ThisistheencryptionKey',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge : Number(process.env.SESSION_MAX_AGE)
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

app.use(flash());
app.use(customMware.setFlash);

// declaring routes folder
app.use('/', require('./routes'));



// connecting server to the port
app.listen(port, function(err){

    if(err){
        console.log('Error in starting up the Server : ', err);
        return;
    }

    console.log('Server is up and running at port : ', port);
});