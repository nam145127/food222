import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../servers/api"

import Header from "../components/Header"
import Footer from "../components/Footer"

import { toast } from "sonner"

export default function Checkout() {

    const navigate = useNavigate()

    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(false)

    const [recipientName, setRecipientName] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [note, setNote] = useState("")

    const [payment, setPayment] = useState("COD")
    const [bank, setBank] = useState("VCB")

    const [orderCode, setOrderCode] = useState("")

    // ================= TOTAL =================

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    // ================= GENERATE ORDER CODE =================

    function generateOrderCode() {

        const time = Date.now()
        const random = Math.floor(100 + Math.random() * 900)

        return `VIPER${time}${random}`

    }

    // ================= BANK =================

    const bankInfo = {

        VCB: {
            name: "Vietcombank",
            account: "1032978540",
            logo: "/img/vcb.png"
        },

        MB: {
            name: "MB Bank",
            account: "987654321",
            logo: "/img/mb.png"
        },

        ACB: {
            name: "ACB Bank",
            account: "456123789",
            logo: "/img/acb.png"
        },

        ICB: {
            name: "VietinBank",
            account: "105877719125",
            logo: "/img/vtb.png"
        }

    }

    const selectedBank = bankInfo[bank]

    // ================= QR =================

    const transferContent = orderCode

    const bankQR =
        total > 0 && orderCode
            ? `https://img.vietqr.io/image/${bank}-${selectedBank.account}-compact2.png?amount=${total}&addInfo=${transferContent}`
            : ""

    // ================= FETCH CART =================

    const fetchCart = async () => {

        try {

            const res = await api.get("/cart")

            setCart(res.data || [])

        } catch (err) {

            console.log(err)

            toast.error("Không tải được giỏ hàng")

        }

    }

    // ================= LOAD PAGE =================

    useEffect(() => {

        fetchCart()

        setOrderCode(generateOrderCode())

    }, [])

    // ================= CHECKOUT =================

    const handleCheckout = async () => {

        if (!recipientName || !address || !phone) {

            toast.error("Vui lòng nhập đầy đủ thông tin")

            return

        }

        if (cart.length === 0) {

            toast.error("Giỏ hàng đang trống")

            return

        }

        setLoading(true)

        try {

            await api.post("/orders", {

                order_code: orderCode,
                recipient_name: recipientName,
                address,
                phone,
                note,
                payment_method: payment

            })

            // toast success

            toast.success("Đặt hàng thành công 🎉", {
                description: "Cảm ơn bạn đã mua hàng tại ViperFood",
                duration: 2000
            })

            // redirect sau 2s

            setTimeout(() => {

                navigate("/")

            }, 2000)

        } catch (err) {

            toast.error(
                err.response?.data?.message || "Checkout error"
            )

        }

        setLoading(false)

    }

    return (

        <div className="bg-gray-50 min-h-screen">

            <Header />

            <section className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold mb-8">
                    Thanh toán đơn hàng
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT */}

                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

                        <h2 className="text-xl font-semibold mb-4">
                            Thông tin giao hàng
                        </h2>

                        <input
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Tên người nhận"
                            className="w-full border rounded-lg px-4 py-3 mb-4"
                        />

                        <input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Địa chỉ giao hàng"
                            className="w-full border rounded-lg px-4 py-3 mb-4"
                        />

                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="w-full border rounded-lg px-4 py-3 mb-4"
                        />

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú đơn hàng"
                            className="w-full border rounded-lg px-4 py-3 mb-6"
                        />

                        <h2 className="text-xl font-semibold mb-4">
                            Phương thức thanh toán
                        </h2>

                        <select
                            value={payment}
                            onChange={(e) => setPayment(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 mb-6"
                        >

                            <option value="COD">
                                Thanh toán khi nhận hàng
                            </option>

                            <option value="BANK">
                                Chuyển khoản ngân hàng
                            </option>

                            <option value="MOMO">
                                MOMO
                            </option>

                        </select>

                        {/* BANK */}

                        {payment === "BANK" && (

                            <div className="border rounded-lg p-4">

                                <h3 className="font-semibold mb-3">
                                    Chọn ngân hàng
                                </h3>

                                <div className="grid grid-cols-4 gap-3 mb-4">

                                    {Object.keys(bankInfo).map(code => (

                                        <button
                                            key={code}
                                            onClick={() => setBank(code)}
                                            className={`border p-2 rounded-lg flex flex-col items-center
${bank === code ? "border-orange-500" : "border-gray-200"}
`}
                                        >

                                            <img
                                                src={bankInfo[code].logo}
                                                className="h-8"
                                            />

                                            <span className="text-xs">
                                                {bankInfo[code].name}
                                            </span>

                                        </button>

                                    ))}

                                </div>

                                <div className="text-center">

                                    {bankQR && (

                                        <img
                                            src={bankQR}
                                            className="w-56 mx-auto"
                                        />

                                    )}

                                    <p className="text-sm text-gray-500 mt-2">
                                        Quét QR để thanh toán
                                    </p>

                                    <p className="text-sm">
                                        Nội dung:
                                        <b className="text-orange-500">
                                            {transferContent}
                                        </b>
                                    </p>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* RIGHT */}

                    <div className="bg-white p-6 rounded-xl shadow h-fit">

                        <h2 className="text-xl font-semibold mb-6">
                            Hóa đơn
                        </h2>

                        <div className="space-y-4">

                            {cart.map(item => (

                                <div key={item.id} className="flex justify-between">

                                    <div className="flex gap-3">

                                        <img
                                            src={item.image_url}
                                            className="w-12 h-12 rounded"
                                        />

                                        <div>

                                            <div className="text-sm font-semibold">
                                                {item.name}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                x{item.quantity}
                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-orange-500 font-semibold">

                                        {(item.price * item.quantity).toLocaleString()}đ

                                    </div>

                                </div>

                            ))}

                        </div>

                        <hr className="my-6" />

                        <div className="flex justify-between mb-2">
                            <span>Tạm tính</span>
                            <span>{total.toLocaleString()}đ</span>
                        </div>

                        <div className="flex justify-between mb-2">
                            <span>Phí ship</span>
                            <span>0đ</span>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between text-lg font-bold mb-6">

                            <span>Tổng</span>

                            <span className="text-orange-500">
                                {total.toLocaleString()}đ
                            </span>

                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
                        >

                            {loading ? "Đang xử lý..." : "Đặt hàng"}

                        </button>

                    </div>

                </div>

            </section>

            <Footer />

        </div>

    )

}