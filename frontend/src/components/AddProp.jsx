import React, { useState } from 'react'
import { authFetch } from '../utils/auth'
import { useProperty } from '../context/PropertyContext'

const AddProp = ({ setAddProp }) => {
    const { getProperties } = useProperty()
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        prop_status: "sale",
        type: "residential",
        address: "",
        city: "",
        state: "",
        country: "Pakistan",
        postal_code: ""
    })


    const [images, setImages] = useState([])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleImages = (e) => {
        setImages([...e.target.files])
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = new FormData()

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key])
        })

        images.forEach((img) => {
            data.append("images", img)
        })

        try {

            const response = await authFetch(`${BASEURL}/api/property/create/`, {
                method: 'POST',
                body: data
            })

            const result = await response.json();

            if (response.ok) {
                getProperties()
                setAddProp(false)
            }
        } catch (error) {
            console.log("Error Adding Property:", error);
        }


    }
    return (<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    
    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
        
        <button
            onClick={() => setAddProp(false)}
            className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
        >
            ✕
        </button>

        <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">
            Create New Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

            <input
                name="title"
                placeholder="Title"
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-blue-500"
                required
            />

            <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-blue-500"
            />

            <input
                name="price"
                placeholder="Price"
                type="number"
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-blue-500"
                required
            />

            <div className="grid grid-cols-2 gap-3">
                <select
                    name="prop_status"
                    onChange={handleChange}
                    className="border rounded-md p-2 focus:outline-blue-500"
                    required
                >
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                </select>

                <select
                    name="type"
                    onChange={handleChange}
                    className="border rounded-md p-2 focus:outline-blue-500"
                >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                </select>
            </div>

            <input
                name="address"
                placeholder="Address"
                onChange={handleChange}
                className="w-full border rounded-md p-2"
            />

            <div className="grid grid-cols-2 gap-3">
                <input
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    className="border rounded-md p-2"
                />
                <input
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    className="border rounded-md p-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input
                    name="country"
                    placeholder="Country"
                    onChange={handleChange}
                    className="border rounded-md p-2"
                />
                <input
                    name="postal_code"
                    placeholder="Postal Code"
                    onChange={handleChange}
                    className="border rounded-md p-2"
                />
            </div>

            <div className="w-full">
    <p className="text-sm text-gray-500 mb-1">
        Add Property Images
    </p>

    <input
        type="file"
        multiple
        onChange={handleImages}
        className="w-full border rounded-md p-2 hover:bg-gray-200 cursor-pointer bg-gray-50"
    />
</div>

            <button
                type="submit"
                className="
                    w-full 
                    bg-blue-600 
                    hover:bg-blue-700 
                    text-white 
                    py-2 
                    rounded-md 
                    transition
                "
            >
                Create Property
            </button>
        </form>
    </div>
</div>
    )
}

export default AddProp