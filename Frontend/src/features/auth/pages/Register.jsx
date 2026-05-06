import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "student",
        branch: "",
        graduationYear: "",
        company: "",
        bio: "",
        expertise: ""
    })

    const { loading, handleRegister } = useAuth()
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister(form)
        if (result?.success) {
            navigate("/portal")
            return
        }
        setError(result?.message || "Unable to register")
    }

    if (loading) {
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register - JUIT Mentor Connect</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input onChange={handleChange} value={form.username} type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input onChange={handleChange} value={form.email} type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input onChange={handleChange} value={form.password} type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="role">Role</label>
                        <select id="role" name="role" value={form.role} onChange={handleChange}>
                            <option value="student">Student</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label htmlFor="branch">Branch</label>
                        <input onChange={handleChange} value={form.branch} type="text" id="branch" name='branch' placeholder='CSE, ECE, IT, etc.' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="graduationYear">Graduation Year</label>
                        <input onChange={handleChange} value={form.graduationYear} type="number" id="graduationYear" name='graduationYear' placeholder='2027' />
                    </div>
                    {form.role === "alumni" && (
                        <div className="input-group">
                            <label htmlFor="company">Company</label>
                            <input onChange={handleChange} value={form.company} type="text" id="company" name='company' placeholder='Current company' />
                        </div>
                    )}
                    <div className="input-group">
                        <label htmlFor="expertise">Skills / Expertise (comma separated)</label>
                        <input onChange={handleChange} value={form.expertise} type="text" id="expertise" name='expertise' placeholder='DSA, React, ML, Placement prep' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="bio">Short Bio</label>
                        <textarea onChange={handleChange} value={form.bio} id="bio" name='bio' placeholder='Tell others what support you need or can offer' />
                    </div>

                    <button className='button primary-button'>Register</button>
                </form>
                {error && <p style={{ color: "#fca5a5", marginTop: "0.8rem" }}>{error}</p>}

                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </main>
    )
}

export default Register
