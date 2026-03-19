import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../servers/api"

import {
  Search,
  ShoppingCart,
  User,
  Moon,
  Sun
} from "lucide-react"

import { toast } from "sonner"

export default function Header() {

  const [dark, setDark] = useState(false)
  const [search, setSearch] = useState("")
  const [openUser, setOpenUser] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem("user") || "null")


  // ======================
  // FETCH CART
  // ======================

  const fetchCart = async () => {

    if (!user) return

    try {

      const res = await api.get("/cart")

      const total = res.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      setCartCount(total)

    } catch (err) {

      console.log(err)

    }

  }


  // ======================
  // LOAD CART
  // ======================

  useEffect(() => {

    fetchCart()

  }, [user])


  // ======================
  // LISTEN CART UPDATE
  // ======================

  useEffect(() => {

    const handleUpdate = () => fetchCart()

    window.addEventListener("cartUpdated", handleUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate)
    }

  }, [])



  // ======================
  // THEME
  // ======================

  const toggleTheme = () => {

    setDark(!dark)
    document.documentElement.classList.toggle("dark")

  }



  // ======================
  // SEARCH
  // ======================

  const handleSearch = (e) => {

    if (e.key === "Enter" && search.trim()) {

      navigate(`/foods?search=${search}`)

    }

  }



  // ======================
  // LOGOUT
  // ======================

  const handleLogout = async () => {

    try {

      const refreshToken = localStorage.getItem("refreshToken")

      if (refreshToken) {

        await api.post("/auth/logout", {
          token: refreshToken
        })

      }

    } catch (error) {

      console.log(error)

    }

    localStorage.clear()

    setCartCount(0)
    setOpenUser(false)

    toast.success("Đã đăng xuất")

    navigate("/login")

  }



  return (

    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b dark:bg-gray-900">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">


        {/* LOGO */}

        <Link
          to="/home"
          className="text-2xl font-bold text-orange-500"
        >
          ViperFood
        </Link>



        {/* MENU */}

        <nav className="hidden lg:flex items-center gap-6 text-gray-700 dark:text-gray-200">

          <Link to="/home" className="hover:text-orange-500">
            Trang chủ
          </Link>

          <Link to="/food" className="hover:text-orange-500">
            Món ăn
          </Link>

          <Link to="/about" className="hover:text-orange-500">
            Giới thiệu
          </Link>

          <Link to="/contact" className="hover:text-orange-500">
            Liên hệ
          </Link>

        </nav>



        {/* SEARCH */}

        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-72">

          <Search size={18} className="text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Tìm món ăn..."
            className="bg-transparent outline-none px-2 w-full text-sm"
          />

        </div>



        {/* ICONS */}

        <div className="flex items-center gap-5 text-gray-700 dark:text-gray-200">


          {/* DARK MODE */}

          <button
            onClick={toggleTheme}
            className="hover:text-orange-500"
          >
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>



          {/* CART */}

          <Link
            to="/cart"
            className="relative hover:text-orange-500"
          >

            <ShoppingCart size={22} />

            {cartCount > 0 && (

              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">

                {cartCount}

              </span>

            )}

          </Link>



          {/* USER */}

          <div className="relative">

            <button
              onClick={() => setOpenUser(!openUser)}
              className="hover:text-orange-500"
            >
              <User size={22} />
            </button>


            {openUser && (

              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">

                {!user ? (

                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Đăng nhập
                  </Link>

                ) : (

                  <>

                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Thông tin cá nhân
                    </Link>

                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Đơn hàng
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Đăng xuất
                    </button>

                  </>

                )}

              </div>

            )}

          </div>

        </div>

      </div>

    </header>

  )

}