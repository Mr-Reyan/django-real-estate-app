


import { data, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { authFetch, getAccessToken } from "../utils/auth"

const PropertyDetail = () => {
    const token = getAccessToken()
    const { id } = useParams()
    const [property, setProperty] = useState(null)
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const { getUser, user } = useAuth()
    const isOwner = user?.id === property?.owner
    const [isLiked, setIsLiked] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [visitDate, setVisitDate] = useState('')
    const [visitTime, setVisitTime] = useState('')
    const [phone,setPhone] = useState('')
    
    useEffect(() => {
        fetchProperty()
        checkLiked()


    }, [id])
    const fetchProperty = async () => {
        const res = await fetch(`${BASEURL}/api/property/${id}`)
        const data = await res.json()
        setProperty(data)
        setFormData(data)
    }
    const checkLiked = async () => {
        try {

            const res = await authFetch(`${BASEURL}/api/property/is_liked/${id}`)
            const data = await res.json()
            setIsLiked(data.liked)


        } catch (e) {
            console.log("Error while checking liked:", e);

        }


    }

    const LikeProperty = async (id) => {

        try {
            const res = await authFetch(`${BASEURL}/api/property/like/${id}`, {
                method: 'POST'
            })


            const data = await res.json()
            checkLiked()
            const totalLikes = property.likes_cout
            if (data.message == "Liked") {

                setProperty({ ...property, likes_cout: totalLikes + 1 })
            } else {
                setProperty({ ...property, likes_cout: totalLikes - 1 })

            }

        } catch (e) {
            console.log("Error while liking:", e)

        }
    }

    const handleEdit = () => {
        if (isEditing) {
            setIsEditing(false)
        } else {
            setFormData({ ...property })
            setIsEditing(true)
        }
    }

    
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const saveChanges = async () => {
        const payload = {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            prop_status: formData.prop_status,
            type: formData.type,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postal_code: formData.postal_code,
        }
        try {
            const res = await authFetch(`${BASEURL}/api/property/update/${property.id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            }
        )
            const data = await res.json()
            if (!res.ok) {
                throw new Error("Update failed");
            }
            setProperty(data)
            setFormData(data)

        } catch (e) {
            console.log(e)

        } finally {
            setIsEditing(false)

        }
    }

    const deleteProperty = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this property?')
        if (!confirmDelete) return
        try {
            
            const res = await authFetch(`${BASEURL}/api/property/delete/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error("Delete Failed.")
                const data = await res.json()
            console.log("deleted: ", data);
        } catch (e) {
            console.log("Error", e);
        }
    }


    const handleVisitRequest = async () => {
        if (!visitDate) {
            alert('Please select a visit date')
            return
        }
        if(!visitTime){
            alert('Please select a visit Time')
            return
        }
        if(!phone){
            alert('Please add your phone')
            return
        }
        if (!user) return
        try {
            const res = await authFetch(
                `${BASEURL}/api/property/submit_req/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: user.username,
                        phone: phone ?? "03001234567",
                        date: visitDate,
                        time: visitTime,
                    })
                }
            )

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Request failed")
            }

            alert("Visit request sent!")
        } catch (err) {
            console.log(err)
            alert("Error sending request")
        }
    }
    
    if (!property) return <p>Loading...</p>

    return (
        <div className="p-6 bg-gray-50 min-h-screen">


            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.images?.map((img) => (
                    <div key={img.id} className="overflow-hidden rounded-lg shadow">
                        <img
                            src={`${BASEURL}${img.image}`}
                            className="w-full h-48 object-cover hover:scale-105 transition"
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-white p-6 rounded-xl shadow">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-blue-700">Property Details</h2>
                    <h4 className="text-sm">Likes: {property.likes_cout}</h4>
                    {!isOwner && token && (
                        <div className="space-x-2">
                            <button
                                onClick={() => LikeProperty(property.id)}
                                className={isLiked ? "px-3 py-1 w-20 bg-red-500 hover:bg-red-600  text-white rounded cursor-pointer" :
                                    "px-3 py-1 bg-green-500 w-20 hover:bg-green-600 text-white rounded cursor-pointer"}
                            >
                                {isLiked ? 'Unlike' : 'Like'}
                            </button>
                        </div>
                    )}
                    {isOwner && (
                        <div className="space-x-2">
                            <button
                                onClick={() => handleEdit()}
                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer"
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>

                            <button
                                onClick={() => deleteProperty(property.id)}
                                className="px-3 py-1 bg-red-500 hover:bg-red-600  text-white rounded cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                    {['title', 'address', 'city', 'state', 'country', 'postal_code', 'price'].map((field) => (
                        <div key={field} className="border p-3 rounded">
                            <p className="text-gray-500 capitalize">{field.replace("_", " ")}</p>

                            {isEditing ? (
                                <input
                                    type={
                                        ["price", "postal_code"].includes(field)
                                            ? "number"
                                            : "text"
                                    }
                                    className="w-full border-2 border-gray-300 p-2"

                                    name={field}
                                    value={formData[field] ?? ""}
                                    onChange={handleChange}
                                />

                            ) : (
                                <p className="font-medium text-gray-800">{property[field]}</p>
                            )}
                        </div>
                    ))}
                    <div className="border p-3 rounded">
                        <p className="text-gray-500 capitalize">Status</p>

                        {isEditing ? (
                            <>
                                <select
                                    name="prop_status"
                                    value={formData.prop_status || ''}
                                    onChange={handleChange}
                                    className="w-full border p-1 rounded"
                                >

                                    <option value="rent">Rent</option>
                                    <option value="sale">Sale</option>
                                </select>
                            </>
                        ) : (
                            <p className="font-medium text-gray-800">{property.prop_status}</p>
                        )}
                    </div>

                </div>

                <div className="mt-4">
                    <p className="text-gray-500">Description</p>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    ) : (
                        <p>{property.description}</p>
                    )}
                </div>

                {isEditing && (
                    <button
                        onClick={saveChanges}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save Changes
                    </button>
                )}
            </div>

            {!isOwner && token && (
                <div className="mt-6 bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold text-blue-700 mb-3">Request Visit</h3>

                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                            type="date"
                            value={visitDate}
                            onChange={(e) => setVisitDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="border p-2 rounded"
                            required
                        />
                        <input type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} className="border p-2 rounded" required />
                        <input type="number" max='13' placeholder="Your Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" required />

                        <button
                            onClick={handleVisitRequest}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Send Request
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PropertyDetail