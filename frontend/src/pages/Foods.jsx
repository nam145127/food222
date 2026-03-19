import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import api from "../servers/api"

import Header from "../components/Header"
import Footer from "../components/Footer"
import FoodCard from "../components/FoodCard"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "../components/ui/pagination"

import { Star } from "lucide-react"

export default function Foods() {

  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("")
  const [search, setSearch] = useState("")
  const [keyword, setKeyword] = useState("")
  const [sort, setSort] = useState("")
  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(true)

  const limit = 8

  // =====================
  // FETCH FOODS
  // =====================

  const fetchFoods = async () => {

    try {

      let url = `/foods?page=${page}&limit=${limit}`

      if (activeCategory) {
        url += `&category_id=${activeCategory}`
      }

      if (keyword) {
        url += `&search=${keyword}`
      }

      if (sort) {
        url += `&sort=${sort}`
      }

      const res = await api.get(url)

      const foodsData = res.data || []

      // kiểm tra còn trang tiếp theo không
      setHasMore(foodsData.length === limit)

      // fetch rating cho từng món
      const foodsWithRating = await Promise.all(

        foodsData.map(async (food) => {

          try {

            const ratingRes = await api.get(`/reviews/rating/${food.id}`)

            return {
              ...food,
              avg_rating: ratingRes.data.avg_rating,
              total_reviews: ratingRes.data.total_reviews
            }

          } catch {

            return {
              ...food,
              avg_rating: 0,
              total_reviews: 0
            }

          }

        })

      )

      setFoods(foodsWithRating)

    } catch (err) {

      console.error("Fetch foods error:", err)

    }

  }

  // =====================
  // FETCH CATEGORIES
  // =====================

  const fetchCategories = async () => {

    try {

      const res = await api.get("/categories")

      setCategories(res.data || [])

    } catch (err) {

      console.error("Fetch categories error:", err)

    }

  }

  // LOAD CATEGORY
  useEffect(() => {
    fetchCategories()
  }, [])

  // LOAD FOODS
  useEffect(() => {
    fetchFoods()
  }, [activeCategory, sort, page, keyword])

  // =====================
  // SEARCH
  // =====================

  const handleSearch = () => {
    setKeyword(search)
    setPage(1)
  }

  return (

    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">

      <Header />

      {/* HERO */}

      <section className="bg-orange-500 text-white py-16">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-4xl font-bold mb-4">
            Khám phá món ăn 🍔
          </h1>

          <p className="opacity-90">
            Hơn 100+ món ăn ngon đang chờ bạn
          </p>

        </div>

      </section>



      {/* SEARCH + SORT */}

      <section className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex flex-1 shadow-lg rounded-lg overflow-hidden">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm món ăn..."
              className="flex-1 px-4 py-3 outline-none"
            />

            <button
              onClick={handleSearch}
              className="bg-orange-500 text-white px-6 hover:bg-orange-600"
            >
              Tìm
            </button>

          </div>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="px-4 py-3 border rounded-lg"
          >

            <option value="">Sắp xếp</option>

            <option value="price_asc">
              Giá thấp → cao
            </option>

            <option value="price_desc">
              Giá cao → thấp
            </option>

          </select>

        </div>

      </section>



      {/* CATEGORY FILTER */}

      <section className="max-w-7xl mx-auto px-6 pb-8">

        <div className="flex gap-3 overflow-x-auto">

          <button
            onClick={() => {
              setActiveCategory("")
              setPage(1)
            }}
            className={`px-5 py-2 rounded-full border whitespace-nowrap
        ${activeCategory === "" ? "bg-orange-500 text-white" : "bg-white"}`}
          >
            Tất cả
          </button>

          {categories.map(cat => (

            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setPage(1)
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border whitespace-nowrap
          ${activeCategory === cat.id ? "bg-orange-500 text-white" : "bg-white"}`}
            >

              <img
                src={cat.image}
                className="w-6 h-6 rounded-full"
              />

              {cat.name}

            </button>

          ))}

        </div>

      </section>



      {/* FOODS GRID */}

      <section className="max-w-7xl mx-auto px-6 pb-10">

        {foods.length === 0 && (

          <div className="text-center py-20 text-gray-500">
            Không tìm thấy món ăn
          </div>

        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {foods.map(food => (

            <motion.div
              key={food.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -6 }}
              className="relative"
            >

              {food.avg_rating > 0 && (

                <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded flex items-center gap-1 text-sm shadow">

                  <Star
                    size={14}
                    className="text-yellow-500 fill-yellow-500"
                  />

                  <span className="font-semibold">
                    {Number(food.avg_rating).toFixed(1)}
                  </span>

                </div>

              )}

              <FoodCard food={food} />

            </motion.div>

          ))}

        </div>

      </section>



      {/* PAGINATION */}

      <Pagination className="pb-20">

        <PaginationContent>

          <PaginationItem>

            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-40" : ""}
            />

          </PaginationItem>

          <PaginationItem>

            <PaginationLink isActive>
              {page}
            </PaginationLink>

          </PaginationItem>

          <PaginationItem>

            <PaginationNext
              onClick={() => hasMore && setPage(page + 1)}
              className={!hasMore ? "pointer-events-none opacity-40" : ""}
            />

          </PaginationItem>

        </PaginationContent>

      </Pagination>



      <Footer />

    </div>

  )

}