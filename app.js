const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

//const User = require("./models/users");
const errorController = require('./controllers/error');
const mongoose = require("mongoose");
const User = require("./models/users");
const app = express();
const csrf = require('csurf');
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet");
const compression  = require("compression");
const morgan = require('morgan');
app.set('view engine', 'ejs');
app.set('views', 'views');






const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const adminProducts = require('./routes/adminProducts');
const authRoutes = require('./routes/auth');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-6lpk6.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;
const store = new MongoDBStore({
  uri: uri,
  collection: 'sessions'
});

const csrfProtection = csrf();
app.use(flash());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));






app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);


// app.use((req, res, next) => {
//     User.findById("5ed21a3fb2f6c10d10bc488b")

//       .then(user => {
//         req.user = user;
//         next();
//       })
//       .then(err => console.log(err));
// });

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err =>{
      throw new Error(err)
    } );
});


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);



app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use("/admin",adminProducts);
// //app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-6lpk6.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then(result => {
    app.listen(process.env.PORT || 2000);
  })
  .catch(err => {
    console.log(err);
  });


