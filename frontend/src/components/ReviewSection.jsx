import React, { useState, useEffect } from "react"
import { FaStar } from "react-icons/fa"
import { authFetch } from "../utils/auth";

const ReviewSection = ({ agentId }) => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(null)
    const [comment, setComment] = useState("")
    const [reviews, setReviews] = useState([])
    const BASEURL = import.meta.env.VITE_DJANGO_URL

    const fetchReviews = async () => {
        try {
            const res = await fetch(
                `${BASEURL}/api/reviews/${agentId}`
            );

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data = await res.json();
            setReviews(data);

        } catch (err) {
            console.log("Review fetch error:", err);
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [agentId])

    const submitReview = async () => {
        try {
            const res = await authFetch(
                `${BASEURL}/api/review/create/${agentId}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        agent:agentId,
                        rating,
                        comment,
                    }),
                }
            );

            const data = await res.json();
            console.log(data)

            if (res.ok) {
                alert("Review submitted!");
                setRating(0);
                setComment("");
                fetchReviews();
            } else {
                alert(data.error || "Review Failed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="review-container">
            <h2>Reviews</h2>

            <div className="flex ">
                {[...Array(5)].map((_, index) => {
                    const current = index + 1;

                    return (
                        <FaStar
                            key={index}
                            size={30}
                            style={{ cursor: "pointer" }}
                            color={current <= (hover || rating) ? "gold" : "gray"}
                            onClick={() => setRating(current)}
                            onMouseEnter={() => setHover(current)}
                            onMouseLeave={() => setHover(null)}
                        />
                    );
                })}
            </div>


            <textarea
                placeholder="Comment (optional)"
                value={comment}
                maxLength="200"
                onChange={(e) => setComment(e.target.value)}
            />

            <button className="bg-blue-500 cursor-pointer p-2 rounded text-white" onClick={submitReview} >
                Submit Review
            </button>

            <hr />

            {reviews.map((review) => {console.log(review) 
            return(
                <div key={review.id} className="review-card">
                    <h4>Username: {review.reviewer_name}</h4>

                    <div>
                        {"⭐".repeat(review.rating)}
                    </div>

                    {review.comment && (
                        <p>{review.comment}</p>
                    )}
                </div>
            )})}
        </div>
    );
};

export default ReviewSection;