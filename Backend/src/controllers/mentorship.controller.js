const userModel = require("../models/user.model")
const mentorRequestModel = require("../models/mentorRequest.model")
const { recommendMentorsForStudent } = require("../services/mentorRecommendation.service")

async function getAllMentorsController(req, res) {
    const mentors = await userModel.find({ role: "alumni" }).select("username email branch graduationYear company bio expertise")

    res.status(200).json({ mentors })
}

async function getRecommendedMentorsController(req, res) {
    const student = await userModel.findById(req.user.id)

    if (!student || student.role !== "student") {
        return res.status(403).json({ message: "Only students can request mentor recommendations" })
    }

    const mentors = await userModel.find({ role: "alumni" }).select("username email branch graduationYear company bio expertise")
    const ranked = recommendMentorsForStudent(student, mentors).slice(0, 10)

    res.status(200).json({ recommendations: ranked })
}

async function createMentorRequestController(req, res) {
    const { mentorId, message } = req.body
    const student = await userModel.findById(req.user.id)

    if (!student || student.role !== "student") {
        return res.status(403).json({ message: "Only students can contact mentors" })
    }

    const mentor = await userModel.findOne({ _id: mentorId, role: "alumni" })

    if (!mentor) {
        return res.status(404).json({ message: "Selected mentor was not found" })
    }

    if (!message || !message.trim()) {
        return res.status(400).json({ message: "Please include a message for the mentor" })
    }

    const mentorRequest = await mentorRequestModel.create({
        student: student._id,
        mentor: mentor._id,
        message: message.trim()
    })

    res.status(201).json({
        message: "Request sent to mentor",
        mentorRequest
    })
}

async function getMyMentorRequestsController(req, res) {
    const currentUser = await userModel.findById(req.user.id)

    if (!currentUser) {
        return res.status(404).json({ message: "User not found" })
    }

    let query = {}

    if (currentUser.role === "student") {
        query = { student: currentUser._id }
    } else {
        query = { mentor: currentUser._id }
    }

    const requests = await mentorRequestModel
        .find(query)
        .populate("student", "username email branch graduationYear")
        .populate("mentor", "username email branch company")
        .sort({ createdAt: -1 })

    res.status(200).json({ requests })
}

async function updateMentorRequestStatusController(req, res) {
    const { requestId } = req.params
    const { status } = req.body

    if (![ "accepted", "rejected" ].includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
    }

    const request = await mentorRequestModel.findById(requestId)

    if (!request) {
        return res.status(404).json({ message: "Request not found" })
    }

    if (String(request.mentor) !== String(req.user.id)) {
        return res.status(403).json({ message: "You can only update requests sent to you" })
    }

    request.status = status
    await request.save()

    res.status(200).json({ message: "Request updated", request })
}

module.exports = {
    getAllMentorsController,
    getRecommendedMentorsController,
    createMentorRequestController,
    getMyMentorRequestsController,
    updateMentorRequestStatusController
}
