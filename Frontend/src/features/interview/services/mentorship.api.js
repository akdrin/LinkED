import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function getMentors() {
    const response = await api.get("/api/mentorship/mentors")
    return response.data
}

export async function getRecommendations() {
    const response = await api.get("/api/mentorship/recommendations")
    return response.data
}

export async function sendMentorRequest({ mentorId, message }) {
    const response = await api.post("/api/mentorship/requests", { mentorId, message })
    return response.data
}

export async function getMyMentorRequests() {
    const response = await api.get("/api/mentorship/requests")
    return response.data
}

export async function updateMentorRequestStatus({ requestId, status }) {
    const response = await api.patch(`/api/mentorship/requests/${requestId}`, { status })
    return response.data
}
