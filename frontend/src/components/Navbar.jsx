import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { clearToken, getAccessToken } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, loading } = useAuth()
    
    
    const handleLogout = () => {
        clearToken()
        window.location.reload()
    }

    if (loading) return null
    return (
        <nav className="z-50 top-0 w-full sticky items-center justify-between flex py-4 px-6 shadow-md bg-white">
            <Link to="/" className="text-2xl font-bold text-gray-800">
                DEAL IN LAND
            </Link>

            <div className="flex items-center gap-6">
                {/* Login/Signup or Logout */}
                {user ? (
                    <button onClick={handleLogout} className="text-gray-800 cursor-pointer hover:text-gray-600 font-medium">Logout</button>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-800 hover:text-gray-600 cursor-pointer font-medium">Login</Link>
                        <Link to="/signup" className="text-gray-800 hover:text-gray-600 cursor-pointer font-medium">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar