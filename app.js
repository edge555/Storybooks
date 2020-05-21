const express= require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport= require('passport');

// Load User model
require('./models/User');

// Passport config
require('./config/passport')(passport)

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

// Load keys
const keys = require('./config/keys')

mongoose.Promise = global.Promise;
// Mongoose connect
mongoose.connect(keys.mongoURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

const app = express();

// Handlebar Middleware\
app.engine('handlebars',exphbs({
    defaultLayout : 'main'
}));
app.set('view engine','handlebars')

app.use(cookieParser());
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    next();
});

// Use routes
app.use('/auth',auth);
app.use('/', index);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server started");
});