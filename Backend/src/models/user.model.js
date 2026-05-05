const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: [true, "Account already exists with this email address"],
        required: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["student", "alumni"],
        required: true
    },

    university: {
        type: String,
        default: "Jaypee University of Information Technology"
    },

    branch: {
        type: String,
        trim: true,
        default: ""
    },

    graduationYear: {
        type: Number
    },

    company: {
        type: String,
        trim: true,
        default: ""
    },

    bio: {
        type: String,
        trim: true,
        default: ""
    },

    expertise: {
        type: [String],
        default: []
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
