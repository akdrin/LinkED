import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export async function register(payload) {
    const response = await api.post('/api/auth/register', payload)
    return response.data
}

export async function login({ username, password }) {
    const response = await api.post("/api/auth/login", { username, password })
    return response.data
}

export async function logout() {
    const response = await api.get("/api/auth/logout")
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/get-me")
    return response.data
}
