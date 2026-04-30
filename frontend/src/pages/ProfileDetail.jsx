import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const ProfileDetail = ({ profile, onUpdate }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_URL

    const [isEditing, setIsEditing] = useState(false)
    const [isOwner,setIsOwner] = useState(false)
    const {getUser} = useAuth()

    useEffect(()=>{
        const checkOwner = async()=>{

         const user = await getUser()
         if(user?.id==profile?.owner){
             setIsOwner(true)
            }
        }
        checkOwner()
        
    })

    const [form, setForm] = useState({
        name: profile.name,
        age: profile.age,
        phone: profile.phone,
        address: profile.address,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }


    const handleUpdate = async (e) => {
        e.preventDefault()

        const res = await authFetch(`${BASEURL}/api/profile/update/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        })

        const data = await res.json()

        if (res.ok) {
            onUpdate(data)
            setIsEditing(false)
        }
    }

    if (!isEditing) {
        return (
            <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">

                <div className="flex items-center justify-between border-b pb-4">

                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    {isOwner &&(

                        <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                        Edit Profile
                    </button>
                    )}

                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-gray-500">Age:</span> {profile.age}</p>
                    <p><span className="text-gray-500">Phone:</span> {profile.phone}</p>
                    <p><span className="text-gray-500">Address:</span> {profile.address}</p>
                </div>

            </div>
        );
    }
      return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        Edit Profile
      </h2>

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Name"
        />

        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Age"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Phone"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Address"
        />

        <div className="flex gap-3">

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  )
}

export default ProfileDetail;