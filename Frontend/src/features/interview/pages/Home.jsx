import React, { useEffect, useState } from 'react'
import "../style/home.scss"
import { useAuth } from '../../auth/hooks/useAuth'
import { getMentors, getMyMentorRequests, getRecommendations, sendMentorRequest, updateMentorRequestStatus } from '../services/mentorship.api'

const Home = () => {
    const { user, handleLogout } = useAuth()
    const [mentors, setMentors] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [requests, setRequests] = useState([])
    const [messageByMentor, setMessageByMentor] = useState({})
    const [loading, setLoading] = useState(false)

    const loadDashboardData = async () => {
        if (!user) return
        setLoading(true)
        try {
            const reqData = await getMyMentorRequests()
            setRequests(reqData.requests || [])

            if (user.role === "student") {
                const [mentorData, recommendationData] = await Promise.all([getMentors(), getRecommendations()])
                setMentors(mentorData.mentors || [])
                setRecommendations(recommendationData.recommendations || [])
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDashboardData()
    }, [user?.id, user?.role])

    const handleRequestMentor = async (mentorId) => {
        const message = messageByMentor[mentorId] || "Hello, I am looking for mentorship guidance."
        await sendMentorRequest({ mentorId, message })
        await loadDashboardData()
    }

    const handleDecision = async (requestId, status) => {
        await updateMentorRequestStatus({ requestId, status })
        await loadDashboardData()
    }

    if (!user) return null

    return (
        <div className='mentor-page'>
            <header className='mentor-header'>
                <div>
                    <h1>JUIT Mentor Connect</h1>
                    <p>Jaypee University of Information Technology - Student and Alumni Community</p>
                </div>
                <div className='mentor-header__meta'>
                    <p>{user.username} ({user.role})</p>
                    <button className='button secondary-button' onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {loading && <p>Loading dashboard...</p>}

            {user.role === "student" && (
                <section className='card'>
                    <h2>ML Recommended Mentors</h2>
                    <p className='muted'>Recommendations are ranked by branch and skills similarity.</p>
                    <div className='mentor-grid'>
                        {recommendations.map(({ mentor, score }) => (
                            <article className='mentor-card' key={mentor._id}>
                                <h3>{mentor.username}</h3>
                                <p>{mentor.branch} | {mentor.company || "Alumni"}</p>
                                <p className='muted'>Match score: {score}%</p>
                                <p>{mentor.bio || "No bio added yet."}</p>
                                <p className='muted'>Skills: {(mentor.expertise || []).join(", ") || "Not provided"}</p>
                                <textarea
                                    placeholder='Write your message to this mentor'
                                    value={messageByMentor[mentor._id] || ""}
                                    onChange={(e) => setMessageByMentor((prev) => ({ ...prev, [mentor._id]: e.target.value }))}
                                />
                                <button className='button primary-button' onClick={() => handleRequestMentor(mentor._id)}>
                                    Request Guidance
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {user.role === "student" && (
                <section className='card'>
                    <h2>All Alumni Mentors ({mentors.length})</h2>
                    <div className='mentor-list'>
                        {mentors.map((mentor) => <p key={mentor._id}>{mentor.username} - {mentor.branch} - {mentor.company || "Alumni"}</p>)}
                    </div>
                </section>
            )}

            <section className='card'>
                <h2>{user.role === "student" ? "My Mentor Requests" : "Incoming Student Requests"}</h2>
                {requests.map((request) => (
                    <article key={request._id} className='request-card'>
                        <p><strong>Student:</strong> {request.student?.username}</p>
                        <p><strong>Mentor:</strong> {request.mentor?.username}</p>
                        <p><strong>Message:</strong> {request.message}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                        {user.role === "alumni" && request.status === "pending" && (
                            <div className='request-actions'>
                                <button className='button primary-button' onClick={() => handleDecision(request._id, "accepted")}>Accept</button>
                                <button className='button secondary-button' onClick={() => handleDecision(request._id, "rejected")}>Reject</button>
                            </div>
                        )}
                    </article>
                ))}
                {!requests.length && <p>No requests yet.</p>}
            </section>
        </div>
    )
}

export default Home
