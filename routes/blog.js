const { Router } = require("express");
const multer = require('multer');
const path = require('path');
const router = Router();

const Blog = require('../models/blog');
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
    res.render('addblog', {
        user: req.user,
    });
});

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy');
    
    res.render('blog', {
        user: req.user,
        blog,
        comments,
    });
});

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        comment: req.body.comment,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
