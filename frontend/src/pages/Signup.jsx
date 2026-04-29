import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [form, setForm] = useState({ email: "", username: "", role: "user", password: "", password2: "" })
    const [message, setMessage] = useState("")
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
            const response = await fetch(`${BASEURL}/api/register/`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage("Account created. Redirecting to Login...")
                setTimeout(() => {
                    navigate("/login")
                }, 1000);
            } else {
                setMessage("Signup response not OK. Error")
            }
        } catch (error) {
            console.log("Error while registering.", error);
            setMessage("Signup Failed.")
        }

    }
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h2 className="font-bold mb-4 text-2xl">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />
                    <select
                        name="role"
                        placeholder="Role"
                        value={form.role}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="user">Visitor</option>
                        <option value="agent">Agent</option>
                    </select>

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={form.password2}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-2"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 cursor-pointer transition duration-300"
                    >
                        Create Acount
                    </button>
                    {message && <p className="text-center text-sm text-green-700 font-semibold mt-3">{message}</p>}

                    <div className="mt-4 text-sm">
                        Already have an account?{" "}
                        {/* <a href="/login" className="text-blue-600 hover:underline">Sign Up</a> */}
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signup