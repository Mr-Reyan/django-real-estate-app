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
                console.log("Success:", result);
                // getProperties()
                setAddProp(false)
            }
        } catch (error) {
            console.log("Error Adding Property:", error);
        }


    }
    return (
        <div className='w-screen h-screen flex items-center justify-center border bg-neutral-200'>
            <button onClick={() => setAddProp(false)}>X</button>
            <br />
            <form onSubmit={handleSubmit} className="p-4 space-y-3 flex flex-col">

                <input
                    name="title"
                    placeholder="Title"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    name="price"
                    placeholder="Price"
                    type="number"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <select name="prop_status" onChange={handleChange} className="border p-2 w-auto min-w-64">
                    <option value="sale">Sale</option>
                    <option value="rent">Rent</option>
                </select>

                <select name="type" onChange={handleChange} className="border p-2 w-auto min-w-64">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                </select>

                <input
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    name="country"
                    placeholder="Country"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    name="postal_code"
                    placeholder="Postal Code"
                    onChange={handleChange}
                    className="border p-2 w-auto min-w-64"
                />

                <input
                    type="file"
                    multiple
                    onChange={handleImages}
                    className="border p-2 w-auto cursor-pointer hover:bg-zinc-300 min-w-64"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Create Property
                </button>

            </form>
        </div>
    )
}

export default AddProp