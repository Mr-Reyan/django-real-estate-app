import { useState } from "react";
import { authFetch } from "../utils/auth";

const CreateProfile = ({ onCreated }) => {
  const BASEURL = import.meta.env.VITE_DJANGO_URL

  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await authFetch(`${BASEURL}/api/profile/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      onCreated(data)

    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        Create Your Profile
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          type="number"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>

      </form>
    </div>
  );
};

export default CreateProfile;