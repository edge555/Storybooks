const express= require('express');
const exphbs = require('express-handlebars');
const bodyParser = require ('body-parser');
const Handlebars = require('handlebars')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport= require('passport');
const path = require('path')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

// Load model
require('./models/User');
require('./models/Story');

// Passport config
require('./config/passport')(passport)

// Load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');
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

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Handlebar middleware
app.engine('handlebars',exphbs({
    defaultLayout : 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
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

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/auth',auth);
app.use('/', index);
app.use('/stories', stories);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("Server started");
});