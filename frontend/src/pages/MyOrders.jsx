import { useEffect, useState } from "react"
import api from "../servers/api"

import Header from "../components/Header"
import Footer from "../components/Footer"

import { toast } from "sonner"

export default function MyOrders() {

    const [orders,setOrders] = useState([])
    const [loading,setLoading] = useState(true)

    const [selectedOrder,setSelectedOrder] = useState(null)

    // ================= FETCH ORDERS =================

    const fetchOrders = async () => {

        try{

            const res = await api.get("/orders/my-orders")

            setOrders(res.data || [])

        }catch(err){

            toast.error("Không tải được đơn hàng")

        }

        setLoading(false)

    }

    useEffect(()=>{

        fetchOrders()

    },[])

    // ================= OPEN DETAIL =================

    const openDetail = async(code)=>{

        try{

            const res = await api.get(`/orders/${code}`)

            setSelectedOrder(res.data)

        }catch(err){

            toast.error("Không tải được chi tiết")

        }

    }

    // ================= CLOSE MODAL =================

    const closeModal = ()=>{

        setSelectedOrder(null)

    }

    return(

        <div className="bg-gray-50 min-h-screen">

            <Header/>

            <section className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold mb-8">
                    Đơn hàng của tôi
                </h1>

                {loading && <p>Đang tải...</p>}

                {!loading && orders.length === 0 && (
                    <p>Bạn chưa có đơn hàng nào</p>
                )}

                <div className="space-y-4">

                    {orders.map(order=>(
                        
                        <div
                            key={order.id}
                            className="bg-white p-6 rounded-xl shadow flex justify-between items-center"
                        >

                            <div>

                                <div className="font-semibold">
                                    Mã đơn: {order.order_code}
                                </div>

                                <div className="text-sm text-gray-500">
                                    Tổng tiền: {order.total_price.toLocaleString()}đ
                                </div>

                                <div className="text-sm">
                                    Trạng thái: 
                                    <span className="ml-2 font-semibold text-orange-500">
                                        {order.status}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={()=>openDetail(order.order_code)}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                            >
                                Xem chi tiết
                            </button>

                        </div>

                    ))}

                </div>

            </section>

            <Footer/>

            {/* ================= MODAL ================= */}

            {selectedOrder && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">

                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-4 text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold mb-4">
                            Chi tiết đơn hàng
                        </h2>

                        <p className="mb-2">
                            Mã đơn: <b>{selectedOrder.order_code}</b>
                        </p>

                        <p className="mb-2">
                            Người nhận: {selectedOrder.recipient_name}
                        </p>

                        <p className="mb-4">
                            Địa chỉ: {selectedOrder.address}
                        </p>

                        <div className="space-y-3">

                            {selectedOrder.items?.map(item=>(
                                
                                <div
                                    key={item.id}
                                    className="flex justify-between border-b pb-2"
                                >

                                    <div>

                                        <div className="font-semibold">
                                            {item.name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            x{item.quantity}
                                        </div>

                                    </div>

                                    <div className="text-orange-500 font-semibold">
                                        {(item.price * item.quantity).toLocaleString()}đ
                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className="mt-6 flex justify-between font-bold">

                            <span>Tổng tiền</span>

                            <span className="text-orange-500">
                                {selectedOrder.total_price.toLocaleString()}đ
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </div>

    )

}