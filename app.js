const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const connect = require('./config/db')
const passport = require('passport')
const router = require('./routes/index');
const path = require('path');

dotenv.config({path:'./config/config.env'});
//Passport Login
require('./config/passport')(passport)
const app = express()
//Body parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Method Override
app.use(methodOverride((req,res)=>{
  if(req.body && typeof req.body==='object' && '_method' in req.body){
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//Logger
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}
connect()
//Handlebar helpers
const {formatDate,stripTags,truncate,editIcon} = require('./helper/hbs')
//Handlebars
app.engine('.hbs',exphbs({helpers:{formatDate,stripTags,truncate,editIcon},defaultLayout:'main', extname:'.hbs'}))
app.set('view engine','.hbs') 

//express-sessions middlewares
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongoUrl: process.env.MONGO_URI})
}))
//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Access User from templates
app.use(function(req,res,next){
  res.locals.user = req.user||null
  next()
})

app.use(express.static(path.join(__dirname,'public'))); 
const PORT = process.env.PORT 
app.listen(PORT,()=>{
    console.log(`Server setup at http://localhost:${PORT}`)
})

app.use('/',router)
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))