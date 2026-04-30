import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useProperty } from '../context/PropertyContext'
import AddProp from "./AddProp"
import { getAccessToken } from "../utils/auth"
import { useAuth } from "../context/AuthContext"
const Properties = () => {
    const { properties, deleteProp, getProperties, prevPage, nextPage, count, page, changePage } = useProperty()

    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [addProp, setAddProp] = useState(false)
    const [user, setUser] = useState(null)
    const { getUser } = useAuth()

    const navigate = useNavigate()



    useEffect(() => {
        getProperties()
        const fetchUser = async () => {
            const token = getAccessToken()
            if (!token) {
                setUser(null)
                return
            }
            const data = await getUser()
            setUser(data)


        }
        fetchUser()
    }, [])



    return (
        <>
            <h4>Total properties:{count}</h4>
            {addProp && <AddProp setAddProp={setAddProp} getProperties={getProperties} />}
            {user && user.role === "agent" && (
                <button
                    onClick={() => setAddProp(true)}
                    className="bg-green-700 cursor-pointer text-white p-2 rounded-sm my-3"
                >
                    Add Property
                </button>
            )}
            <div className="w-screen flex flex-wrap justify-center items-center py-10 px-4 ">

                {
                    properties.map((item, index) => (

                        <div onClick={() => navigate(`/property/${item.id}`)} className="block cursor-pointer rounded-lg p-4 shadow-xs shadow-indigo-100" key={index}>
                            <img alt=""
                                src={item.images?.find(img => img.is_primary)?.image
                                    ? `${BASEURL}${item.images.find(img => img.is_primary).image}`
                                    : item.images?.[0]?.image
                                        ? `${BASEURL}${item.images[0].image}`
                                        : "/nothing.jpg"
                                }
                                className="h-56 w-50 rounded-md object-cover" />

                            <div className="mt-2">
                                <dl>
                                    <div>
                                        <dt className="sr-only">Price</dt>

                                        <dd className="text-sm text-gray-500">${item.price}</dd>
                                    </div>

                                    <div>
                                        <dt className="sr-only">Address</dt>

                                        <dd className="font-medium">{item.address}</dd>
                                    </div>
                                </dl>

                                <div className="mt-6 flex items-center gap-8 text-xs">
                                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                        <svg className="size-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                                        </svg>

                                        <div className="mt-1.5 sm:mt-0">
                                            <p className="text-gray-500">Country</p>

                                            <p className="font-medium">{item.country}</p>
                                        </div>
                                    </div>

                                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                        <svg className="size-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                        </svg>

                                        <div className="mt-1.5 sm:mt-0">
                                            <p className="text-gray-500">Status</p>

                                            <p className="font-medium">{(item.prop_status)}</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>




                    ))
                }
            </div>
            <div className="flex gap-3 w-auto justify-center items-center">





                

                <button
                    disabled={!prevPage}
                    onClick={() => changePage(Number(page) - 1)}
                    type="button" className="py-3 px-4 cursor-pointer inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent  bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:outline-hidden focus:bg-zinc-200 active:bg-zinc-200 disabled:opacity-50  disabled:pointer-events-none" >
                    Previous
                </button>
                <button
                    disabled={!nextPage}
                    onClick={() => changePage(Number(page) + 1)}

                    type="button" className="py-3 px-4 inline-flex cursor-pointer items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent  bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:outline-hidden focus:bg-zinc-200 active:bg-zinc-200 disabled:opacity-50  disabled:pointer-events-none" >
                    Next
                </button>
            </div>
        </>
    )
}

export default Properties