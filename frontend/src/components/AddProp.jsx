import React, { useState } from 'react'
import { authFetch } from '../utils/auth'
import { useProperty } from '../context/PropertyContext' 

const AddProp = ({setAddProp}) => {
    const {getProperties} = useProperty()
    const BASEURL = import.meta.env.VITE_DJANGO_URL
    const [formData, setFormData] = useState({
        "title": "",
        "price": "",
        "status": "Sale",
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{

            const res = await authFetch(`${BASEURL}/api/property/create/`,{
                method:'POST',
                headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
            })
            const data = await res.json();
            console.log("Success:", data);

            if (res.ok) {
            getProperties()
            setAddProp(false)
      }
    } catch(error){
        console.log("Error Adding Property:",error);
    }


    }
    return (
        <div className='w-screen h-screen flex items-center justify-center bg-neutral-200'>
            <form
                method='POST'
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl flex flex-col  items-center justify-center shadow-md min-w-xl space-y-4"
            >
                <button type='button' onClick={()=>setAddProp(false)}>X</button>
                <input 
                onChange={handleChange}
                value={formData.title}
                className="w-full p-2 border rounded"
                placeholder='Title'
                type="text"
                name="title"
                />
                <input 
                onChange={handleChange}
                value={formData.price}
                className="w-full p-2 border rounded"
                placeholder='Price'
                type="number"
                name="price"
                />
                <select
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                name="status"
                >
                    <option value="Sale">Sale</option>
                    <option value="Rent">Rent</option>
                </select>
                <input
                className='w-full bg-black text-white p-2 rounded hover:bg-gray-800'
                type="submit" value="Add Property"
                />
            </form>
        </div>
    )
}

export default AddProp