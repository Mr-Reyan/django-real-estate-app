import { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { useProperty } from "../context/PropertyContext";
import { useNavigate, useParams } from "react-router-dom";
import ReviewSection from "../components/ReviewSection";

const ProfileDetail = ({ profile, onUpdate }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_URL
  const [avgRating, setAvgRating] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const { getUser, user } = useAuth()
  const { profileProp, deleteProp, getProfileProp } = useProperty()

  const navigate = useNavigate()


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
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      onUpdate(data)

      setIsEditing(false)

    }
  }

  const { id } = useParams()

  useEffect(() => {
    const checkOwner = async () => {

      const user = await getUser()
      if (user?.id == profile?.owner) {
        setIsOwner(true)
      }
    }
    checkOwner()

  }, [])
  const profileId = id || user?.id

  useEffect(() => {
    if (profileId) {
      getProfileProp(profileId)
    }
  }, [profileId])

  if (!isEditing) {
    return (
      <>
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">

          <div className="flex items-center justify-between border-b pb-4">

            <h2 className="text-xl font-semibold">{profile.name}</h2>
            {isOwner && (

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
            <p><span className="text-gray-600 text-lg font-bold">Rating:</span>⭐ {avgRating.toFixed(1)}</p>
          </div>

        </div>
        <div className="w-screen flex flex-col justify-center items-center py-10 px-4">



          <ReviewSection agentId={profile.owner} setAvgRating={setAvgRating} />
        </div>





        <div className="w-screen flex flex-wrap justify-center items-center py-10 px-4 ">

          {
            profileProp?.map((item, index) => (

              <div onClick={() => navigate(`/property/${item.id}`)} className="block cursor-pointer rounded-lg p-4 shadow-xs shadow-indigo-100" key={index}>
                <img alt=""
                  src={item.images?.find(img => img.is_primary)?.image
                    ? `${BASEURL}${item.images.find(img => img.is_primary).image}`
                    : item.images?.[0]?.image
                      ? `${BASEURL}${item.images[0].image}`
                      : "/media/properties/bed.jpg"
                  }
                  className="h-56 w-50 rounded-md object-cover" />

                <div className="mt-2">
                  <dl>
                    <div>
                      <dt className="sr-only">Price</dt>

                      <dd className="text-sm text-gray-500">${item.price}</dd>
                    </div>

                    <div>
                      <dt className="sr-only">Address</dt>

                      <dd className="font-medium">{item.address}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex items-center gap-8 text-xs">
                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                      <svg className="size-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
                      </svg>

                      <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Country</p>

                        <p className="font-medium">{item.country}</p>
                      </div>
                    </div>

                    <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                      <svg className="size-4 text-indigo-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>

                      <div className="mt-1.5 sm:mt-0">
                        <p className="text-gray-500">Status</p>

                        <p className="font-medium">{(item.prop_status)}</p>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </>
    )
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

export default ProfileDetail