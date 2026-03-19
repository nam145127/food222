import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "../servers/api"

function ContactPage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.name || !form.email || !form.message) {
            toast.error("Vui lòng nhập đầy đủ thông tin ❌");
            return;
        }

        try {

            setLoading(true);

            await api.post("/contacts", form);

            toast.success("Gửi liên hệ thành công ✅");

            setForm({
                name: "",
                email: "",
                phone: "",
                message: "",
            });

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Gửi thất bại ❌"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col overflow-hidden">

            <Header />

            {/* ================= HERO ================= */}

            <section className="relative h-[55vh] flex items-center justify-center text-white overflow-hidden">

                <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                    alt="contact"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60"></div>

                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative text-center px-6"
                >

                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                        Liên Hệ Với VIPER FOOD 📞
                    </h1>

                    <p className="text-lg opacity-90">
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc
                    </p>

                </motion.div>

            </section>

            {/* ================= CONTACT INFO + FORM ================= */}

            <section className="px-6 md:px-20 py-20 bg-white">

                <div className="grid md:grid-cols-2 gap-16">

                    {/* ===== Thông tin ===== */}

                    <motion.div
                        initial={{ x: -80, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >

                        <h2 className="text-3xl font-bold mb-8">
                            Thông tin liên hệ
                        </h2>

                        <div className="space-y-5 text-gray-700 text-lg">

                            <p>
                                <strong>📍 Địa chỉ:</strong><br />
                                Thôn 5, Xã Hòa Bình, Huyện Vĩnh Bảo,<br />
                                Thành phố Hải Phòng, Việt Nam
                            </p>

                            <p>
                                <strong>📞 Hotline:</strong><br />
                                <a
                                    href="tel:0909123456"
                                    className="text-orange-600 font-semibold hover:underline"
                                >
                                    0909 123 456
                                </a>
                            </p>

                            <p>
                                <strong>✉ Email:</strong><br />
                                support@viperfood.vn
                            </p>

                            <p>
                                <strong>🕒 Giờ mở cửa:</strong><br />
                                08:00 - 22:00 mỗi ngày
                            </p>

                        </div>

                        <div className="mt-10 bg-orange-50 p-6 rounded-xl">

                            <h3 className="text-xl font-semibold mb-3">
                                Vì sao chọn chúng tôi?
                            </h3>

                            <ul className="list-disc list-inside space-y-2 text-gray-700">

                                <li>Nguyên liệu tươi mới mỗi ngày</li>
                                <li>Giao hàng nhanh chóng</li>
                                <li>Chăm sóc khách hàng tận tâm</li>

                            </ul>

                        </div>

                    </motion.div>

                    {/* ===== Form ===== */}

                    <motion.div
                        initial={{ x: 80, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >

                        <form className="space-y-5" onSubmit={handleSubmit}>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Họ và tên"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            />

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            />

                            <input
                                type="text"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            />

                            <textarea
                                rows="4"
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Nội dung tin nhắn"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            >

                                {loading ? "Đang gửi..." : "Gửi liên hệ"}

                            </Button>

                        </form>

                    </motion.div>

                </div>

            </section>

            {/* ================= MAP ================= */}

            <section className="px-6 md:px-20 pb-20">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden shadow-xl"
                >

                    <iframe
                        title="map"
                        src="https://www.google.com/maps?q=20.656285,106.554704&hl=vi&z=15&output=embed"
                        width="100%"
                        height="450"
                        loading="lazy"
                        className="border-0"
                    />

                </motion.div>

            </section>

            <Footer />

        </div>
    );
}

export default ContactPage;