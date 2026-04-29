import { useState, useEffect, createContext, useContext } from "react";
import { authFetch, getAccessToken } from "../utils/auth";
const PropertyContext = createContext()

export const PropertyProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [properties, setProperties] = useState([])
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [count, setCount] = useState(0)
    const [currentUrl, setCurrentUrl] = useState(`${BASEURL}/api/property/`)


    const getProperties = async (url = currentUrl) => {
        try {
            const res = await fetch(url)

            if (!res.ok) {
                throw new Error("HTTP Error. status:" + res.status)
            }

            const data = await res.json()


            setProperties(data.results || null)
            setNextPage(data.next)
            setPrevPage(data.previous)
            setCount(data.count)

        } catch (e) {
            console.log("Error fetching Property", e)
        }
    }

    useEffect(() => {
        getProperties(currentUrl)

    }, [])

    const fetchPage = (url) => {
        getProperties(url)
    }

    const deleteProp = async (id) => {
        try {
            const res = await authFetch(`${BASEURL}/api/property/delete/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ item_id: id })
            })

            if (!res.ok) throw new Error("Delete failed")

            getProperties(currentUrl)

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <PropertyContext.Provider
            value={{ deleteProp, getProperties, properties, prevPage, nextPage, count, fetchPage }}
        >
            {children}
        </PropertyContext.Provider>
    )
}

export const useProperty = () => useContext(PropertyContext)