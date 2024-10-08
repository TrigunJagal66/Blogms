const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const userRoute = require('./routes/user');
const blogRoute = require("./routes/blog");
const cookieParser = require('cookie-parser'); 
const Blog = require('./models/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Atlas URL
const MONGODB_URL = process.env.MONGODB_URL;

// Connecting to MongoDB Atlas (no deprecated options)
mongoose.connect(MONGODB_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        res.render('home', {
            user: req.user,
            blogs: allBlogs,
        });
    } catch (error) {
        res.status(500).send("Error fetching blogs");
    }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));


