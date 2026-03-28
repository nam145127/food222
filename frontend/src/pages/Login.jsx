import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../servers/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ❌ Chặn double submit
    setLoading(true);

    try {
      if (isLogin) {
        // ================= LOGIN =================
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        const data = res.data.data || res.data;
        const accessToken = data?.accessToken;
        const refreshToken = data?.refreshToken;
        const user = data?.user;

        if (!user) {
          toast.error("Sai email hoặc mật khẩu");
          return;
        }

        if (!user.is_active) {
          toast.error("Tài khoản đã bị khóa 🚫");
          return;
        }

        localStorage.clear();
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        toast.success("Đăng nhập thành công 🎉");

        setForm((prev) => ({ ...prev, password: "" }));

        const role = user.role?.trim().toLowerCase();
        if (role === "admin" || role === "staff") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        // ================= REGISTER =================
        await api.post("/auth/register", form);

        toast.success("Đăng ký thành công 🎉");
        setForm({
          name: "",
          email: "",
          password: ""
        });
        setIsLogin(true);
      }
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.msg ||
        "Đăng ký thất bại";

      toast.error(message);

      setForm((prev) => ({ ...prev, password: "" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836)"
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <Card className="relative w-full max-w-md backdrop-blur-lg bg-white/40 border-white/20 shadow-2xl rounded-2xl">
        <CardHeader className="space-y-2 text-center">
          <div className="text-3xl font-bold text-black">🍔 Viper</div>

          <CardTitle className="text-xl text-black">
            {isLogin ? "Chào mừng quay lại" : "Tạo tài khoản"}
          </CardTitle>

          <CardDescription className="text-gray-700">
            {isLogin
              ? "Đăng nhập để tiếp tục"
              : "Đăng ký để bắt đầu đặt món"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                name="name"
                placeholder="Tên của bạn"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-white/80 border-gray-300"
              />
            )}

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-white/80 border-gray-300"
            />

            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
                className="pr-10 bg-white/80 border-gray-300"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white/70 backdrop-blur-md text-black font-semibold border border-white/40 hover:bg-white/90"
            >
              {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">hoặc</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <p className="text-center text-sm text-black">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-semibold cursor-pointer hover:underline"
            >
              {isLogin ? "Đăng ký" : "Đăng nhập"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
