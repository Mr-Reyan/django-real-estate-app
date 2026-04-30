import { useState, useEffect, createContext, useContext } from "react";
import {useSearchParams} from 'react-router-dom'
import { authFetch, getAccessToken } from "../utils/auth";
const PropertyContext = createContext()

export const PropertyProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [properties, setProperties] = useState([])
    const [nextPage, setNextPage] = useState(null)
    const [prevPage, setPrevPage] = useState(null)
    const [count, setCount] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentUrl, setCurrentUrl] = useState()

    const page = searchParams.get("page") || 1

    const getProperties = async (pageNumber = page) => {
        try {
            const res = await fetch(`${BASEURL}/api/property/?page=${pageNumber}`)

            if (!res.ok) {
                throw new Error("HTTP Error. status:" + res.status)
            }

            const data = await res.json()

            if(data.results.length == 0 && pageNumber > 1){
                const newPage = pageNumber - 1
                setSearchParams({page: newPage})
                return getProperties(newPage)
            }

            console.log(data.results);
            
            setProperties(data.results || null)
            setNextPage(data.next)
            setPrevPage(data.previous)
            setCount(data.count)

        } catch (e) {
            console.log("Error fetching Property", e)
        }
    }

    useEffect(() => {
        getProperties(page)

    }, [])

    const changePage = (newPage) => {
    setSearchParams({ page: newPage })   
    getProperties(newPage)               
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

            getProperties(page)

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <PropertyContext.Provider
            value={{ deleteProp, getProperties, properties, prevPage, nextPage, count, changePage, page }}
        >
            {children}
        </PropertyContext.Provider>
    )
}

export const useProperty = () => useContext(PropertyContext)