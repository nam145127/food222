import Header from "@/components/Header"
import Footer from "@/components/Footer"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import api from "../servers/api"
import { toast } from "sonner"

import { Star } from "lucide-react"

export default function FoodDetail() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [food, setFood] = useState(null)
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(true)

    const [showCartPopup, setShowCartPopup] = useState(false)

    // ======================
    // REVIEW STATE
    // ======================

    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [canReview, setCanReview] = useState(false)
    const [ratingSummary, setRatingSummary] = useState(null)


    // ======================
    // FETCH DATA
    // ======================

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true)

                const foodRes = await api.get(`/foods/${id}`)
                setFood(foodRes.data)

                const reviewRes = await api.get(`/reviews/food/${id}`)
                setReviews(reviewRes.data)

                const ratingRes = await api.get(`/reviews/rating/${id}`)
                setRatingSummary(ratingRes.data)

                try {

                    const canReviewRes = await api.get(`/reviews/can-review/${id}`)
                    setCanReview(canReviewRes.data.canReview)

                } catch {
                    setCanReview(false)
                }

            } catch (err) {

                console.error(err)
                toast.error("Không tải được món ăn")

            } finally {

                setLoading(false)

            }

        }

        fetchData()

    }, [id])


    // ======================
    // ADD TO CART
    // ======================

    const addCart = async () => {

        try {

            await api.post("/cart/add", {
                food_id: food.id,
                quantity: qty
            })

            window.dispatchEvent(new Event("cartUpdated"))

            setShowCartPopup(true)

        } catch (err) {

            if (err.response?.status === 401) {
                toast.error("Bạn cần đăng nhập")
            } else {
                toast.error("Thêm giỏ hàng thất bại")
            }

        }

    }


    // ======================
    // SUBMIT REVIEW
    // ======================

    const submitReview = async () => {

        if (!comment.trim()) {
            toast.error("Vui lòng nhập nhận xét")
            return
        }

        try {

            await api.post("/reviews", {
                food_id: food.id,
                rating,
                comment
            })

            toast.success("Đánh giá thành công")

            setComment("")
            setRating(5)

            const res = await api.get(`/reviews/food/${id}`)
            setReviews(res.data)

            const ratingRes = await api.get(`/reviews/rating/${id}`)
            setRatingSummary(ratingRes.data)

        } catch (err) {

            toast.error(err.response?.data?.message || "Không thể gửi đánh giá")

        }

    }


    // ======================
    // LOADING
    // ======================

    if (loading) {

        return (

            <div className="min-h-screen flex flex-col">

                <Header />

                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Đang tải món ăn...
                </div>

                <Footer />

            </div>

        )

    }


    // ======================
    // UI
    // ======================

    return (

        <div className="min-h-screen flex flex-col bg-gray-50">

            <Header />

            <div className="flex-1">

                <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">


                    {/* IMAGE */}

                    <img
                        src={food.image_url}
                        className="w-full rounded-xl shadow"
                    />



                    {/* INFO */}

                    <div>

                        <h1 className="text-3xl font-bold mb-4">
                            {food.name}
                        </h1>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {food.description}
                        </p>

                        <p className="text-orange-500 text-3xl font-bold mb-6">
                            {new Intl.NumberFormat("vi-VN").format(food.price)} đ
                        </p>


                        {/* RATING SUMMARY */}

                        {ratingSummary && (

                            <div className="flex items-center gap-2 mb-6">

                                <Star className="text-yellow-500 fill-yellow-500" />

                                <span className="font-semibold">
                                    {Number(ratingSummary.avg_rating || 0).toFixed(1)}
                                </span>

                                <span className="text-gray-500 text-sm">
                                    ({ratingSummary.total_reviews} đánh giá)
                                </span>

                            </div>

                        )}


                        {/* QUANTITY */}

                        <div className="flex items-center gap-4 mb-8">

                            <button
                                onClick={() => qty > 1 && setQty(qty - 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                -
                            </button>

                            <span className="text-lg font-semibold">
                                {qty}
                            </span>

                            <button
                                onClick={() => setQty(qty + 1)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                +
                            </button>

                        </div>


                        {/* ADD CART */}

                        <button
                            onClick={addCart}
                            className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition"
                        >
                            Thêm vào giỏ hàng
                        </button>

                    </div>

                </div>


                {/* ======================
REVIEWS
====================== */}

                <div className="max-w-4xl mx-auto p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Đánh giá món ăn
                    </h2>


                    {/* REVIEW FORM */}

                    {canReview ? (

                        <div className="bg-white p-4 rounded-lg shadow mb-8">

                            <h3 className="font-semibold mb-3">
                                Viết đánh giá
                            </h3>

                            <div className="flex gap-2 mb-4">

                                {[1, 2, 3, 4, 5].map((s) => (

                                    <Star
                                        key={s}
                                        size={28}
                                        onClick={() => setRating(s)}
                                        className={`cursor-pointer ${s <= rating
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-300"
                                            }`}
                                    />

                                ))}

                            </div>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Nhận xét của bạn..."
                                className="w-full border p-2 rounded mb-3"
                            />

                            <button
                                onClick={submitReview}
                                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                            >
                                Gửi đánh giá
                            </button>

                        </div>

                    ) : (

                        <p className="text-gray-500 mb-6">
                            Bạn cần mua món này trước khi đánh giá
                        </p>

                    )}


                    {/* REVIEW LIST */}

                    <div className="space-y-4">

                        {reviews.length === 0 && (

                            <p className="text-gray-500">
                                Chưa có đánh giá nào
                            </p>

                        )}

                        {reviews.map((r) => (

                            <div
                                key={r.id}
                                className="bg-white p-4 rounded-lg shadow"
                            >

                                <div className="flex justify-between mb-2">

                                    <span className="font-semibold">
                                        {r.name}
                                    </span>

                                    <div className="flex">

                                        {[...Array(r.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className="text-yellow-500 fill-yellow-500"
                                            />
                                        ))}

                                    </div>

                                </div>

                                <p className="text-gray-600">
                                    {r.comment}
                                </p>

                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(r.created_at).toLocaleDateString()}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            <Footer />


            {/* ======================
POPUP CART
====================== */}

            {showCartPopup && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl p-6 w-96 text-center shadow-lg">

                        <h2 className="text-xl font-semibold mb-2 text-green-600">
                            ✔ Đã thêm vào giỏ
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Bạn muốn làm gì tiếp theo?
                        </p>

                        <div className="flex gap-3">

                            <button
                                onClick={() => navigate("/food")}
                                className="flex-1 border py-2 rounded hover:bg-gray-100"
                            >
                                Tiếp tục mua
                            </button>

                            <button
                                onClick={() => navigate("/cart")}
                                className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                            >
                                Xem giỏ hàng
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}