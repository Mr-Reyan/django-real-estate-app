import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { authFetch, clearToken, getAccessToken } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const [isOpen, setIsOpen] = useState(false)
    const BASEURL = import.meta.env.VITE_DJANGO_URL;
    const { user, loading } = useAuth()
    const [profile, setProfile] = useState(null)
    const navigate = useNavigate()



    let token = getAccessToken()
    const handleLogout = () => {
        token = getAccessToken()
        clearToken()
        window.location.reload()
    }

    
    if (loading) return null

    return (
        
        <nav className="z-50 top-0 w-full sticky flex items-center justify-between py-4 px-6 shadow-md bg-white">


            <a href="/" className="text-2xl font-bold text-gray-800">
                DEAL IN LAND
            </a>

            <div className="hidden md:flex items-center gap-6 px-4 py-3 bg-white shadow-sm rounded-lg">
                <a href="/" className="text-gray-700 font-medium hover:text-green-600">Properties</a>
                <a href="/agents" className="text-gray-700 font-medium hover:text-green-600">Agents</a>
            </div>

            <div className="hidden md:flex items-center gap-6">
                {token && (
                        <>
                            <button
                                onClick={() => {
                                    navigate(`/my_requests`)
                                    setIsOpen(false)
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                Sent Requests
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/profile`)
                                    setIsOpen(false)
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                My Profile
                            </button>
                            {user.role == "agent" &&
                            <button
                            onClick={() => {
                                navigate(`/requests`)
                                setIsOpen(false)
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                Visit Requests
                            </button>
                            }
                        </>
                )}

                {user ? (
                    <button onClick={handleLogout} className="cursor-pointer text-gray-800 hover:text-gray-600 font-medium">
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-800 hover:text-gray-600 font-medium">Login</Link>
                        <Link to="/signup" className="text-gray-800 hover:text-gray-600 font-medium">Sign Up</Link>
                    </>
                )}
            </div>


            <button
                className="md:hidden text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden">

                    <a href="/" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Properties</a>
                    <a href="/agents" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Agents</a>
                    <a href="/filter" onClick={() => setIsOpen(false)} className="text-gray-700 font-medium">Filters</a>

                    {token && (
                        <>
                            <button
                                onClick={() => {
                                    navigate(`/my_requests`)
                                    setIsOpen(false)
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                Sent Requests
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/profile`)
                                    setIsOpen(false)
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                My Profile
                            </button>
                            <button
                                onClick={() => {
                                    navigate(`/requests`)
                                    setIsOpen(false)
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-indigo-700 bg-indigo-600 text-white rounded"
                            >
                                Visit Requests
                            </button>
                        </>
                    )}

                    {user ? (
                        <button onClick={handleLogout} className="text-gray-800 font-medium">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar