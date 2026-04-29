import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken } from '../utils/auth'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [form, setForm] = useState({ username: "", password: ""})
    const [message, setMessage] = useState("")
    const {setUser,getUser} = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")
        try {
            const response = await fetch(`${BASEURL}/api/token/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            })
            const data = await response.json()
            
            
            if (response.ok) {
                saveToken(data)
                setMessage("Login Successful. Redirecting...")
                const userData = getUser()
                setUser(userData)
                
                setTimeout(() => {
                    navigate("/")
                }, 1000);
            } else {
                setMessage("Invalid username or password!")
                return
                
            }
        } catch (error) {
            console.log("Error while Logging in.", error);
            setMessage("Login Failed.")
        }

    }
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="font-bold mb-4 text-2xl">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-3">

                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />


                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 cursor-pointer transition duration-300"
                    >
                        Login
                    </button>
                    {message && <p className="text-center text-sm text-green-700 font-semibold mt-3">{message}</p>}

                    <div className="mt-4 text-sm">
                        Don't have an account?{" "}
                        {/* <a href="/login" className="text-blue-600 hover:underline">Sign Up</a> */}
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Login