const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const userRoute = require('./routes/user');
const blogRoute=require("./routes/blog");
const cookieParser = require('cookie-parser'); // Fixed typo
const Blog=require('./models/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err)); // Added error handling

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token")); // Ensure validateToken is imported

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('./public')));

app.get('/', async(req, res) => {
    const allBlogs=await Blog.find({});
    res.render('home', {
        user: req.user,
        blogs:allBlogs, // This will be `undefined` if not authenticated
    });
});

app.use("/user", userRoute);
app.use("/blog",blogRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
