const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

const db = require("./models");

require('./services/passport');

const dashboard = require("./routes/index");
const user = require("./routes/user");
const posts = require("./routes/post");
const comments = require("./routes/comment");
const api = require("./routes/api");

app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(session({
  secret: 'pwill',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter(param, msg, value) {
    let namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', dashboard);
app.use('/user', user);
app.use('/post', posts);
app.use('/comment', comments);
app.use('/api', api);

const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
  });
});
