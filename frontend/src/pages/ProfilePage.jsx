import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import api from "../servers/api";

function ProfilePage() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // ================= GET PROFILE =================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const res = await api.get("/profile");

                setForm(res.data);

            } catch (error) {

                toast.error("Không tải được thông tin người dùng");

            } finally {

                setFetching(false);

            }

        };

        fetchProfile();

    }, []);

    // ================= CHANGE INPUT =================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    // ================= UPDATE PROFILE =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await api.put("/profile", form);

            toast.success("Cập nhật thông tin thành công ✅");

        } catch (error) {

            toast.error(
                error.response?.data?.message || "Cập nhật thất bại ❌"
            );

        } finally {

            setLoading(false);

        }

    };

    if (fetching) {

        return <div className="text-center py-20">Đang tải...</div>;

    }

    return (

        <div className="bg-gray-50 min-h-screen flex flex-col">

            <Header />

            {/* ================= HERO ================= */}

            <section className="bg-orange-600 text-white py-16 text-center">

                <motion.h1
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl font-bold"
                >
                    Thông Tin Cá Nhân 👤
                </motion.h1>

            </section>

            {/* ================= PROFILE FORM ================= */}

            <section className="px-6 md:px-20 py-16 flex justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-xl"
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
                            disabled
                            className="w-full p-3 border rounded-lg bg-gray-100"
                        />

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />

                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Địa chỉ"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                        </Button>

                    </form>

                </motion.div>

            </section>

            <Footer />

        </div>
    );
}

export default ProfilePage;