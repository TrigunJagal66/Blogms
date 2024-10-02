const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    comment: { type: String, required: true },
    blogId: {
        type: Schema.Types.ObjectId, 
        ref: "blog",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user", // Changed to lowercase 'user'
    },
}, { timestamps: true });

const Comment = model("comment", commentSchema);
module.exports = Comment;
