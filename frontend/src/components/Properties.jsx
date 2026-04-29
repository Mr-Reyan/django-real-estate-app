import { useEffect, useState } from "react"
import { useProperty } from '../context/PropertyContext'
import AddProp from "./AddProp"
import {  getAccessToken } from "../utils/auth"
import { useAuth } from "../context/AuthContext"
const Properties = () => {
    const { properties, deleteProp, getProperties } = useProperty()

    const [addProp, setAddProp] = useState(false)
    const [user, setUser] = useState(null)
    const {getUser} = useAuth()


    

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
                                {user && user.id == item.owner ?(
                                    <>
                                    <button className="bg-blue-700 cursor-pointer text-white p-2 rounded-sm my-3">Edit</button>
                                <button
                                className="bg-red-500 cursor-pointer text-white p-2 rounded-sm my-3"
                                onClick={() => { deleteProp(item.id) }}
                                >Delete</button>
                                </>
                            ):(
                                <></>
                            )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Properties