import { useEffect, useState } from "react"
import { useProperty } from '../context/PropertyContext'
import AddProp from "./AddProp"
import { getAccessToken } from "../utils/auth"
import { useAuth } from "../context/AuthContext"
const Properties = () => {
    const { properties, deleteProp, getProperties, prevPage, nextPage, count, fetchPage } = useProperty()

    const [addProp, setAddProp] = useState(false)
    const [user, setUser] = useState(null)
    const { getUser } = useAuth()




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
            <div className="w-screen py-10 px-4 ">

                {user && user.role === "agent" && (
                    <button
                        onClick={() => setAddProp(true)}
                        className="bg-blue-700 cursor-pointer text-white p-2 rounded-sm my-3"
                    >
                        Add Property
                    </button>
                )}
                {
                    properties.map((item, index) => (
                        <div key={index} className="border-yellow-950 border-2 rounded-2xl max-w-100 flex flex-col  text-center justify-center items-center">
                            <h2 className="text-3xl font-bold text-zinc-800">{item.title}</h2>
                            <h2 className=" font-bold text-gray-600">{item.price}</h2>
                            <h2 className="text-3xl font-bold text-zinc-700">{item.status}</h2>
                            {/* <button onClick={()=>console.log(item.owner)}>LOG</button> */}
                            <div className="flex flex-row gap-2">
                                {user && user.id == item.owner ? (
                                    <>
                                        <button className="bg-blue-700 cursor-pointer text-white p-2 rounded-sm my-3">Edit</button>
                                        <button
                                            className="bg-red-500 cursor-pointer text-white p-2 rounded-sm my-3"
                                            onClick={() => { deleteProp(item.id) }}
                                        >Delete</button>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    ))
                }
                <div>
                    

                    {/* <button
                        onClick={() => fetchPage(1)}
                    >
                        1
                    </button>
                    <button
                        onClick={() => fetchPage(2)}
                    >
                        2
                    </button>
                    <button
                        onClick={() => fetchPage(3)}
                    >
                        3
                    </button>
                    <button
                        onClick={() => fetchPage(4)}
                    >
                        4
                    </button> */}

                    <button
                    disabled={!prevPage}
                    onClick={() => getProperties(prevPage)} 
                    type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent  bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:outline-hidden focus:bg-zinc-200 active:bg-zinc-200 disabled:opacity-50  disabled:pointer-events-none" >
                        Previous
                    </button>
                    <button
                    disabled={!nextPage}
                    onClick={() => getProperties(nextPage)} 
                    
                    type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent  bg-zinc-100 text-zinc-800 hover:bg-zinc-200 focus:outline-hidden focus:bg-zinc-200 active:bg-zinc-200 disabled:opacity-50  disabled:pointer-events-none" >
                        Next
                    </button>
                </div>
            </div>
        </>
    )
}

export default Properties