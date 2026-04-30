import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { authFetch } from "../utils/auth"

const PropertyDetail = () => {
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const { getUser, user } = useAuth()
    const isOwner = user?.id === property?.owner

    useEffect(() => {
        const fetchProperty = async () => {
            const res = await fetch(`${BASEURL}/api/property/${id}`)
            const data = await res.json()
            setProperty(data)
        }

        fetchProperty()
    }, [id])

    if (!property) return <p>Loading...</p>
    console.log(property.images);

    const handleVisitRequest = async () => {
        try {
            const res = await authFetch(
                `${BASEURL}/api/property/submit_req/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: "Reyan",   // or from user profile
                        phone: "03001234567",
                        date: "2026-05-01",
                        time: "14:00",
                    })
                }
            );

            const data = await res.json()
            console.log(data)

            if (!res.ok) {
                throw new Error(data.error || "Request failed")
            }

            alert("Visit request sent!")
        } catch (err) {
            console.log(err)
            alert("Error sending request")
        }
    };

    return (
        <div className="p-4">

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
                {property.images?.map((img) => (
                    <div key={img.id} className="overflow-hidden rounded-lg shadow">
                        <img
                            src={`${BASEURL}${img.image}`}
                            className="w-full h-50 object-cover hover:scale-105 transition duration-300"
                        />
                    </div>
                ))}
            </div>
            <div className="flow-root">
                <dl className="-my-3 divide-y divide-gray-200 rounded border border-gray-200 text-sm *:even:bg-gray-50">


                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Title</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.title}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Address</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.address}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">City</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.city}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">State</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.state}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Country</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.country}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Postal Code</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.postal_code}</dd>
                    </div>
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Status</dt>

                        <dd className="text-gray-700 sm:col-span-2">{property.prop_status}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Price</dt>

                        <dd className="text-gray-700 sm:col-span-2">${property.price}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Bio</dt>

                        <dd className="text-gray-700 sm:col-span-2">
                            {property.description}
                        </dd>
                    </div>
                </dl>
            </div>


            {!isOwner && (
                <button
                    onClick={handleVisitRequest}
                    className="mt-6 w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 active:scale-95 transition"
                >
                    Request Visit
                </button>
            )}
        </div>
    )
}

export default PropertyDetail