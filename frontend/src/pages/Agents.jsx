import React, { useEffect, useState } from 'react'
import { useProperty } from '../context/PropertyContext';
import { useNavigate } from 'react-router-dom';

const Agents = () => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const { setNextPage, setPrevPage, setCount } = useProperty()
    const [agents, setAgents] = useState(null)
    const navigate = useNavigate()
    const fetchAgents = async (url = `${BASEURL}/api/agents/`) => {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        setAgents(data.results);
        setNextPage(data.next);
        setPrevPage(data.previous);
        setCount(data.count);
    }
    useEffect(() => {
        fetchAgents()
    }, [])
    if(!agents) return
    return (
        <div className="w-screen flex flex-wrap justify-center items-center py-10 px-4 ">

            {
                agents.map((item, index) => (

                    <div onClick={() => navigate(`/profile/${item.id}`)} className="block cursor-pointer rounded-lg p-4 shadow-xs shadow-indigo-100" key={index}>

                        <div className="mt-2">
                            <dl>

                                <div>
                                    <dt className="sr-only">Name</dt>

                                    <dd className="font-medium">{item.name}</dd>
                                </div>
                            </dl>

                            <div className="mt-6 flex items-center gap-8 text-xs">
                                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                    <svg className="size-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                                    </svg>

                                    <div className="mt-1.5 sm:mt-0">
                                        <p className="text-gray-500">Age</p>

                                        <p className="font-medium">{item.age}</p>
                                    </div>
                                </div>

                                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                    <svg
                                        className="size-4 text-indigo-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 5.25C3 4.007 4.007 3 5.25 3h1.372c.516 0 .965.352 1.093.85l.97 3.882a1.125 1.125 0 01-.32 1.098L7.3 10.965a16.001 16.001 0 006.035 6.035l2.135-1.065a1.125 1.125 0 011.098-.32l3.882.97c.498.128.85.577.85 1.093v1.372A2.25 2.25 0 0118.75 21C10.06 21 3 13.94 3 5.25z"
                                        />
                                    </svg>

                                    <div className="mt-1.5 sm:mt-0">
                                        <p className="text-gray-500">Phone</p>

                                        <p className="font-medium">{(item.phone)}</p>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Agents