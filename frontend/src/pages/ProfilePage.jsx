import { useState, useEffect } from "react"
import CreateProfile from "../components/CreateProfile"
import ProfileDetail from "./ProfileDetail"
import { useNavigate, useParams } from "react-router-dom"
import { authFetch, getAccessToken } from "../utils/auth"
import { useProperty } from "../context/PropertyContext"

const ProfilePage = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const { id } = useParams()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()
    const token = getAccessToken()
    const fetchProfile = async () => {
        try {
            let res;
            const url = id?`${BASEURL}/api/profile/${id}`:
            `${BASEURL}/api/profile/me/`
            if (id) {
                res = await fetch(url)
                
            } else {
                res = await authFetch(url)
            }

            if (res.status === 404) {

                setProfile(null)
                alert("Create a profile first!")
                
                return
            }

            const data = await res.json()
            setProfile(data)

        } catch (err) {
            console.log(err)    
            setProfile(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    if (loading) return <>Loading..</>

    return (
        <div>

            <div>

                {!profile ? (
                    <div className="text-center">
                        <p className="mb-4 text-gray-600">
                            You don't have a profile yet!
                        </p>

                        <CreateProfile onCreated={(data) => setProfile(data)} />
                    </div>
                ) : (
                    <ProfileDetail profile={profile} onUpdate={(data) => setProfile(data)} />
                )}
            </div>
            
        </div>
    )
}


export default ProfilePage