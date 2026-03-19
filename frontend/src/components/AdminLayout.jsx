import { Link, Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import {
  User,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  Utensils,
  Folder,
  ChevronDown,
  ChevronRight
} from "lucide-react"

import api from "../servers/api"

export default function AdminLayout() {

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user"))

  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [productMenu, setProductMenu] = useState(false)

  // ======================
  // LOAD THEME
  // ======================
  useEffect(() => {

    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {

      document.documentElement.classList.add("dark")
      setDark(true)

    }

  }, [])

  // ======================
  // TOGGLE DARK MODE
  // ======================
  const toggleTheme = () => {

    const newTheme = !dark

    setDark(newTheme)

    if (newTheme) {

      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")

    } else {

      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")

    }

  }

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = async () => {

    try {

      const refreshToken = localStorage.getItem("refreshToken")

      await api.post("/auth/logout", {
        token: refreshToken
      })

    } catch (error) {

      console.log(error)

    }

    localStorage.clear()

    navigate("/login")

  }

  return (

    <div className="flex h-screen bg-background text-foreground">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-64 bg-card border-r border-border">

        <div className="p-4 text-xl font-bold border-b border-border">
          🍔 Trang quản trị
        </div>

        <nav className="p-4 flex flex-col gap-2">

          {/* DASHBOARD */}

          <Link
            to="/admin"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer "
          >

            <LayoutDashboard size={18} />

            Tổng quan

          </Link>

          {/* USERS */}

          <Link
            to="/admin/users"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer "
          >

            <Users size={18} />

           Quản lý người dùng

          </Link>

          {/* PRODUCT MENU */}

          <button
            onClick={() => setProductMenu(!productMenu)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-accent"
          >

            <div className="flex items-center gap-2 cursor-pointer ">

              <Utensils size={18} />

              Quản lý sản phẩm

            </div>

            {productMenu
              ? <ChevronDown size={16} />
              : <ChevronRight size={16} />
            }

          </button>

          {/* SUB MENU */}

          {productMenu && (

            <div className="ml-6 flex flex-col gap-1">

              <Link
                to="/admin/categories"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
              >

                <Folder size={16} />

                Danh mục

              </Link>

              <Link
                to="/admin/foods"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
              >

                <Utensils size={16} />

                Món ăn

              </Link>




            </div>

          )}

          
              <Link
            to="/admin/orders"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer "
          >

            <orders size={18} />

           Quản lý đơn hàng

          </Link>

           <Link
            to="/admin/contacts"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer "
          >

            <contacts size={18} />

           Quản lý liên hệ 

          </Link>
          

        </nav>

      </aside>

      {/* ================= MAIN ================= */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <header className="bg-card border-b border-border p-4 flex justify-between items-center">

          <h1 className="font-semibold text-lg">
            Bảng điều khiển
          </h1>

          <div className="flex items-center gap-4">

            {/* DARK MODE */}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent"
            >

              {dark
                ? <Sun size={18} />
                : <Moon size={18} />
              }

            </button>

            {/* USER MENU */}

            <div className="relative">

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:bg-accent p-2 rounded-lg"
              >

                <User size={18} />

                <span className="text-sm font-medium">
                  {user?.name}
                </span>

              </button>

              {open && (

                <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg">

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full p-2 hover:bg-accent rounded-lg"
                  >

                    <LogOut size={16} />

                    Đăng xuất

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 p-6 overflow-auto">

          <Outlet />

        </main>

      </div>

    </div>

  )

}