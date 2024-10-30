const express = require('express');
const mongoose = require('mongoose');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const User = require('./models/User');

// Kết nối đến MongoDB
mongoose.connect('mongodb+srv://anhphucpro13:123456a@cluster0.r2atg.mongodb.net/SDN', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Tạo ứng dụng Express
const app = express();

// Cấu hình Handlebars làm view engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'styles')));

// Cấu hình để phân tích dữ liệu từ form
app.use(express.urlencoded({ extended: false }));

// Cấu hình session middleware
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// Khởi tạo Passport và thiết lập session
app.use(passport.initialize());
app.use(passport.session());

// Sử dụng Passport-Local-Mongoose strategy cho Passport
passport.use(new LocalStrategy(User.authenticate()));

// Serialize và Deserialize user cho session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Trang chính
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

// Trang đăng ký
app.get('/register', (req, res) => {
    res.render('register');
});

// Xử lý đăng ký
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    User.register(new User({ username }), password, (err, user) => {
        if (err) {
            return res.render('register', { error: err.message });
        }
        // Đăng ký thành công, xác thực ngay  
            res.redirect('/login');
    });
});

// Trang đăng nhập
app.get('/login', (req, res) => {
    res.render('login');
});

// Xử lý đăng nhập
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

// Trang profile khi người dùng đã đăng nhập thành công
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('profile', { user: req.user });
    } else {
        res.redirect('/login');
    }
});

// Đăng xuất người dùng
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
