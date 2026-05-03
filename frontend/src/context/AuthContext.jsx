import { useContext,createContext,useState, useEffect } from "react";
import { getAccessToken,authFetch } from "../utils/auth";

const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [user, setUser] = useState(null)
    const [loading,setLoading] = useState(true)
    const getUser = async () => {
        try {

            const token = getAccessToken()
            if(!token) return null
            
            const res = await authFetch(`${BASEURL}/api/user/`)
            
            if (!res.ok) return null
            
            

            return await res.json()


        } catch (err) {
            console.log(err);
            return null
        }
    }

    useEffect(()=>{
        const fetchUser = async ()=>{
            const data = await getUser()
            setUser(data)
            
            setLoading(false)
        }
        fetchUser()
    },[])

    return (
        <AuthContext.Provider value={{user,setUser,getUser,loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)