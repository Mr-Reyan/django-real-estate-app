import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Home } from 'lucide-react';
import { authFetch } from '../utils/auth';

const BASEURL = import.meta.env.VITE_DJANGO_URL


export default function MyVisitRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRequests()
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/my_requests/`)
      const data = await res.json()
      setRequests(data)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  };

  const completeRequest = async (id) => {
    try {
      const res = await authFetch(`${BASEURL}/api/requests/${id}/completed/`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Failed to complete request')

      fetchMyRequests()
    } catch (err) {
      console.log(err)
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">My Visit Requests</h1>

      {requests.length === 0 ? (
        <p>No requests sent yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => {
            console.log(req.status)
            console.log(req)
            
            const primaryImage = req.property?.images?.find(
              (img) => img.is_primary
            );

            const imageUrl = primaryImage
              ? `${BASEURL}${primaryImage.image}`
              : req.property?.images?.[0]?.image
              ? `${BASEURL}${req.property.images[0].image}`
              : '/bed.jpg';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={imageUrl}
                  alt="property"
                  className="w-full h-52 object-cover"
                />

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Home size={18} />
                    <h2 className="font-semibold text-lg">
                      {req.property?.title}
                    </h2>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    Visit Date: {req.date}
                  </p>

                  <div className="mb-3">
                    {req.status === 'pending' && (
                      <span className="flex items-center gap-2 text-yellow-600">
                        <Clock size={18} /> Pending
                      </span>
                    )}

                    {req.status === 'approved' && (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={18} /> Approved
                      </span>
                    )}


                    {req.status === 'rejected' && (
                      <span className="flex items-center gap-2 text-red-600">
                        <XCircle size={18} /> Rejected
                      </span>
                    )}

                    {req.status === 'completed' && (
                      <span className="flex items-center gap-2 text-blue-600">
                        <CheckCircle size={18} /> Completed
                      </span>
                    )}
                  </div>

                  {req.status === 'approved' && (
                    <button
                      onClick={() => completeRequest(req.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
