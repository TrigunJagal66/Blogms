const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageURL: {
        type: String,
        default: '/images/project.jpg',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true });

userSchema.pre("save", function(next) {
    const user = this;

    // Check if the password has been modified or is new
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString('hex'); // Correctly converting salt to hex string
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    // Assign the salt and hashed password to the user document
    user.salt = salt;
    user.password = hashedPassword; // Correct variable usage

    next(); // Call next() to proceed with saving the document
});

userSchema.static("matchPasswordAndGenerateToken" ,async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found!');

    const salt=user.salt;
    const hashedPassword=user.password;
    const userProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashedPassword!==userProvidedHash) throw new Error('Incorrect Password');

    const token=createTokenForUser(user);
    return token;

});

const User = model('user', userSchema);

module.exports = User;
