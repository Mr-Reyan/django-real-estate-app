import { useEffect, useState } from "react"
import { useProperty } from '../context/PropertyContext'
import AddProp from "./AddProp"
import { getAccessToken } from "../utils/auth"
import { useAuth } from "../context/AuthContext"
const Properties = () => {
    const { properties, deleteProp, getProperties, prevPage, nextPage, count, page, changePage } = useProperty()

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
            {user && user.role === "agent" && (
                <button
                    onClick={() => setAddProp(true)}
                    className="bg-blue-700 cursor-pointer text-white p-2 rounded-sm my-3"
                >
                    Add Property
                </button>
            )}
            <div className="w-screen flex flex-wrap justify-center items-center py-10 px-4 ">

                {
                    properties.map((item, index) => (
                        // <div key={index} className="border-yellow-950 border-2 rounded-2xl max-w-100 flex flex-col  text-center justify-center items-center">
                        //     <div className=""></div>
                        //     <h2 className="text-3xl font-bold text-zinc-800">{item.title}</h2>
                        //     <h2 className=" font-bold text-gray-600">{item.price}</h2>
                        //     <h2 className="text-3xl font-bold text-zinc-700">{item.status}</h2>
                        //     {/* <button onClick={()=>console.log(item.owner)}>LOG</button> */}
                        //     <div className="flex flex-row gap-2">
                        //         {user && user.id == item.owner ? (
                        //             <>
                        //                 <button className="bg-blue-700 cursor-pointer text-white p-2 rounded-sm my-3">Edit</button>
                        //                 <button
                        //                     className="bg-red-500 cursor-pointer text-white p-2 rounded-sm my-3"
                        //                     onClick={() => { deleteProp(item.id) }}
                        //                 >Delete</button>
                        //             </>
                        //         ) : (
                        //             <></>
                        //         )}
                        //     </div>
                        // </div>


                        <div key={index} className="w-full max-w-sm  p-6 border rounded-lg h-78 bg-white shadow-xs">
                            <a href="#">
                                <img className="rounded-base mb-6" src={item} alt={item.title} />
                            </a>
                            <div>
                                <div className="flex items-center space-x-3 mb-6">
                                    {/* <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                        <p>{item.owner}</p>
                                    </div> */}
                                    <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">{
                                        item.country}</span>
                                    <span className="bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">{
                                        item.city}</span>
                                </div>
                                <a href="#">
                                    <h5 className="text-xl text-heading font-semibold tracking-tight">{item.title}</h5>
                                </a>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-2xl font-bold text-heading">${item.price}</span>
                                    <button type="button" className="inline-flex items-center  text-white bg-blue-600 hover:bg-blue-700 box-border border border-transparent focus:ring-4 focus:ring-white shadow-xs font-medium leading-5 rounded cursor-pointer text-sm px-3 py-2 focus:outline-none">
                                        {/* <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" /></svg> */}
                                        Visit
                                    </button>
                                </div>
                            </div>
                        </div>





                    ))
                }
            </div>
            <div className="flex gap-3 w-auto justify-center items-center">



                <button
                    onClick={() => changePage(1)}
                >
                    First
                </button>
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