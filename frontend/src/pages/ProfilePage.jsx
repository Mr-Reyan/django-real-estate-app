import { useState, useEffect } from "react"
import CreateProfile from "./CreateProfile"
import ProfileDetail from "./ProfileDetail"
import { useParams } from "react-router-dom"
import { authFetch } from "../utils/auth"

const ProfilePage = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const { id } = useParams()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async () => {
        try {

            let res;

            if (id) {
                res = await fetch(`${BASEURL}/api/profile/${id}`)
            } else {
                res = await authFetch(`${BASEURL}/api/profile/me/`)
            }

            if (res.status === 404) {
                setProfile(null)
                console.log("Create a profile first!")
                
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
    )
}


export default ProfilePage