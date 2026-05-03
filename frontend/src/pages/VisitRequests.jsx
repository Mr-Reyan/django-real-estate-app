import { useEffect, useState } from "react"
import { authFetch } from "../utils/auth"

const BASEURL = import.meta.env.VITE_DJANGO_URL

function VisitRequests() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/get_requests`)
            const data = await res.json()

            setRequests(data)
        } catch (err) {
            console.log("Error fetching requests:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (id, action) => {
        try {
            await authFetch(`${BASEURL}/api/requests/${id}/${action}/`, {
                method: "PATCH"
            })

            setRequests(prev =>
                prev.map(req =>
                    req.id === id ? { ...req, status: action } : req
                )
            )

        } catch (err) {
            console.log("Action error:", err)
        }
    }

    useEffect(() => {
        fetchRequests()

    }, [])

    if (loading) {
        return <div className="text-center py-10">Loading requests...</div>
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
                Visit Requests
            </h1>

            {requests.length === 0 ? (
                <p className="text-gray-500 text-center">No requests found</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {requests.map(req => (
                        <div
                            key={req.id}
                            className="bg-white  shadow-md rounded-xl p-4 flex flex-col justify-between"
                        >
                            <div className="object-cover flex items-center justify-center w-full h-60">
                                <img src={
                                    req.property?.images?.find((img) => img.is_primary)?.image
                                        ? `${BASEURL}${req.property.images.find(
                                            (img) => img.is_primary
                                        ).image}`
                                        : req.property?.images?.[0]?.image
                                            ? `${BASEURL}${req.property.images[0].image}`
                                            : "/bed.jpg"
                                }
                                    alt="property"
                                    className="h-56 w-50 rounded-md object-cover" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold whitespace-nowrap text-ellipsis text-gray-800">
                                    Property: {req.property.title}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Visitor:{" "}
                                    <span className="font-medium">
                                        {req.user.username}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    Request Date: {req.created_at?.slice(0, 10)}
                                </p>
                                <p className="text-sm text-gray-800">
                                    Visit Time: {req.time?.split(":").slice(0, 2).join(":")}
                                </p>

                                <span
                                    className={`inline-block text-xs px-2 py-1 rounded-full ${req.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : req.status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : req.status === "rejected" ? "bg-red-100 text-red-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {req.status}
                                </span>
                            </div>

                            {req.status === "pending" && (
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() =>
                                            handleAction(req.id, "approved")
                                        }
                                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleAction(req.id, "rejected")
                                        }
                                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
export default VisitRequests