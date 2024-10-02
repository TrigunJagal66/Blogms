const express = require("express");
const User = require('../models/user');
const router = express.Router();

router.get("/signin", (req, res) => {
    return res.render('signin');
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});

router.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        await User.create({
            fullname,
            email,
            password
        });
        return res.redirect("/");
    } catch (err) {
        console.error("Error during user signup:", err);
        return res.status(500).send("An error occurred during signup.");
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect("/");
});

module.exports = router;
