const mongoose = require("mongoose")

const mentorRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

mentorRequestSchema.index({ student: 1, mentor: 1, createdAt: -1 })

module.exports = mongoose.model("mentorRequests", mentorRequestSchema)
