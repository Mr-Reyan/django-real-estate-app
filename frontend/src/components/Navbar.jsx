import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { authFetch, clearToken, getAccessToken } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const BASEURL = import.meta.env.VITE_DJANGO_URL;
    const { user, loading } = useAuth()
    const [profile,setProfile] = useState(null)
    const navigate = useNavigate()
        
        

    const handleLogout = () => {
        clearToken()
        window.location.reload()
    }

    if (loading) return null

    return (
        <nav className="z-50 top-0 w-full sticky items-center justify-between flex py-4 px-6 shadow-md bg-white">
            <a href="/" className="text-2xl font-bold text-gray-800">
                DEAL IN LAND
            </a>
            <div className="flex items-center gap-6 px-4 py-3 bg-white shadow-sm rounded-lg">

                <a
                    href="/"
                    className="text-gray-700 font-medium hover:text-green-600 transition"
                >
                    Popular
                </a>

                <a
                    href="/agents"
                    className="text-gray-700 font-medium hover:text-green-600 transition"
                >
                    Agents
                </a>

                <a
                    href="#"
                    className="text-gray-700 font-medium hover:text-green-600 transition"
                >
                    Filters
                </a>

            </div>
            <div className="flex items-center gap-6">
                {!profile &&(
                    <button onClick={()=>navigate(`/profile`)} className="px-4 py-2 bg-indigo-600 text-white rounded" >My Profile</button>
                )}
                {user ? (
                    <button onClick={handleLogout} className="text-gray-800 cursor-pointer hover:text-gray-600 font-medium">Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-800 hover:text-gray-600 cursor-pointer font-medium">Login</Link>
                        <Link to="/signup" className="text-gray-800 hover:text-gray-600 cursor-pointer font-medium">Sign Up</Link>
                    </>
                )}
                {/* Login/Signup or Logout */}
            </div>
        </nav>
    )
}

export default Navbar