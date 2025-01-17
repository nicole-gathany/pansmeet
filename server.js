const express = require('express');
const { Db } = require('mongodb'); 
// const MongoClient = require('mongodb').MongoClient
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/database')
const authRoutes = require('./routes/auth')
const homeRoute = require('./routes/main')
const feedRoutes = require('./routes/feed')
//const authRoute = require('./routes/auth')
//const profileRoute = require('./routes/profile')
//const feedRoute = require('./routes/feed')

require('dotenv').config({ path: "./config/.env" });

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  // Passport middleware
app.use(passport.initialize())
app.use(passport.session())

  
app.use('/', homeRoute)
app.use('/auth', authRoutes)
app.use('/feed', feedRoutes)


app.listen(process.env.PORT || PORT, () => {
    console.log('....Server running');
})