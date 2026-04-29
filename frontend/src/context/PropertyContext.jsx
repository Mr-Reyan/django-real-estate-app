import { useState,useEffect,createContext,useContext } from "react";
import { authFetch,getAccessToken } from "../utils/auth";
const PropertyContext = createContext()

export const PropertyProvider = ({children}) => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [properties, setProperties] = useState([])
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [cout, setCout] = useState(null)

    const getProperties = async () => {
        try {
            const res = await fetch(`${BASEURL}/api/property/`)

            if(!res.ok){
                throw new Error("HTTP Error. status:"+res.status)
            }
            
            const data = await res.json()
            console.log(data)
            
            setProperties(data.results)
            setNextPage(data.next)
            setPrevPage(data.previous)
            setCount(data.count)

        } catch (e) {
            console.log("Error fetching Property", e);

        }
    }
    
    useEffect(() => {

        getProperties()

    }, [])

    const deleteProp = async (id) => {
        await authFetch(`${BASEURL}/api/property/delete/`,{
            method:'DELETE',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({item_id:id})
        })
        getProperties()

    }

    return (
        <PropertyContext.Provider
                value={{deleteProp,getProperties,properties }}
                >
                    {children}
        </PropertyContext.Provider>
    )
}

export const useProperty = () => useContext(PropertyContext)