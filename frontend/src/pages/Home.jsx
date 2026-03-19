import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import api from "../servers/api"

import Header from "../components/Header"
import Footer from "../components/Footer"
import ChatBox from "../components/ChatBox";
import FoodCard from "../components/FoodCard"

import { Star } from "lucide-react"

const slides = [
  {
    title: "Đồ ăn ngon giao tận nơi",
    subtitle: "Hơn 100+ món ăn hấp dẫn",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
  },
  {
    title: "Pizza nóng hổi mỗi ngày",
    subtitle: "Hương vị tuyệt vời cho mọi gia đình",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  },
  {
    title: "Burger & FastFood",
    subtitle: "Giao hàng nhanh chỉ 30 phút",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349"
  }
]

export default function Home(){

  const [foods,setFoods] = useState([])
  const [categories,setCategories] = useState([])
  const [activeCategory,setActiveCategory] = useState("")
  const [slide,setSlide] = useState(0)

  const foodSectionRef = useRef(null)

  const scrollToFoods = ()=>{
    foodSectionRef.current?.scrollIntoView({behavior:"smooth"})
  }

  useEffect(()=>{

    const timer = setInterval(()=>{
      setSlide(prev => (prev + 1) % slides.length)
    },5000)

    return ()=>clearInterval(timer)

  },[])

  // ======================
  // FETCH FOODS + RATING
  // ======================

  const fetchFoods = async (category="")=>{

    try{

      let url="/foods"

      if(category) url+=`?category_id=${category}`

      const res = await api.get(url)

      const foodsData = res.data || []

      // fetch rating cho từng món
      const foodsWithRating = await Promise.all(

        foodsData.map(async(food)=>{

          try{

            const ratingRes = await api.get(`/reviews/rating/${food.id}`)

            return {
              ...food,
              avg_rating: ratingRes.data.avg_rating,
              total_reviews: ratingRes.data.total_reviews
            }

          }catch{

            return {
              ...food,
              avg_rating: 0,
              total_reviews: 0
            }

          }

        })

      )

      setFoods(foodsWithRating)

    }catch(err){

      console.error(err)

    }

  }

  const fetchCategories = async ()=>{

    const res = await api.get("/categories")

    setCategories(res.data || [])

  }

  useEffect(()=>{

    fetchFoods()
    fetchCategories()

  },[])

  const handleCategory=(id)=>{

    setActiveCategory(id)
    fetchFoods(id)

  }

  const current = slides[slide]

  return(

    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">

      <Header/>

      {/* HERO */}

      <section className="relative h-[550px] overflow-hidden">

        <img
          src={current.image}
          className="absolute w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50"/>

        <motion.div
          key={slide}
          initial={{opacity:0,y:40}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.7}}
          className="relative z-10 h-full flex items-center justify-center"
        >

          <div className="text-center text-white px-6 max-w-xl">

            <h1 className="text-5xl font-bold mb-4">
              {current.title}
            </h1>

            <p className="text-lg mb-6 opacity-90">
              {current.subtitle}
            </p>

            <button
              onClick={scrollToFoods}
              className="bg-orange-500 px-8 py-3 rounded-lg text-white font-semibold hover:bg-orange-600 transition"
            >
              Khám phá món ăn
            </button>

          </div>

        </motion.div>

      </section>


      {/* CATEGORIES */}

      <section className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-2xl font-bold mb-6">
          Danh mục món ăn
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2">

          <button
            onClick={()=>handleCategory("")}
            className={`px-5 py-2 rounded-full border
            ${activeCategory===""?"bg-orange-500 text-white":"bg-white dark:bg-gray-800"}`}
          >
            Tất cả
          </button>

          {categories.map(cat=>(

            <button
              key={cat.id}
              onClick={()=>handleCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full border whitespace-nowrap
              ${activeCategory===cat.id?"bg-orange-500 text-white":"bg-white dark:bg-gray-800"}`}
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


      {/* ALL FOODS */}

      <section
        ref={foodSectionRef}
        className="max-w-7xl mx-auto px-6 pb-20"
      >

        <h2 className="text-2xl font-bold mb-6">
          Tất cả món ăn
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {foods.slice(0,8).map(food=>(

            <motion.div
              key={food.id}
              initial={{opacity:0,y:30}}
              whileInView={{opacity:1,y:0}}
              transition={{duration:0.4}}
              viewport={{once:true}}
              whileHover={{y:-10}}
              className="relative"
            >

              {/* RATING BADGE */}

              {food.avg_rating > 0 && (

                <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800 px-2 py-1 rounded flex items-center gap-1 text-sm shadow">

                  <Star size={14} className="text-yellow-500 fill-yellow-500"/>

                  <span className="font-semibold">
                    {Number(food.avg_rating).toFixed(1)}
                  </span>

                </div>

              )}

              <FoodCard food={food}/>

            </motion.div>

          ))}

        </div>

      </section>


      
      {/* FOOD EXPERIENCE */}

      <section className="bg-white dark:bg-gray-800 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-12">
            Khám phá trải nghiệm ẩm thực
          </h2>

          <div className="grid md:grid-cols-4 gap-10 text-center">

            <div>
              <div className="text-4xl mb-3">🍕</div>
              <h3 className="font-semibold mb-2">
                Hương vị hấp dẫn
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Những món ăn được chế biến với hương vị đậm đà.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">🥗</div>
              <h3 className="font-semibold mb-2">
                Nguyên liệu tươi
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Sử dụng nguyên liệu tươi ngon mỗi ngày.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">🍔</div>
              <h3 className="font-semibold mb-2">
                Đa dạng món ăn
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Nhiều lựa chọn từ pizza, burger đến fastfood.
              </p>
            </div>

            <div>
              <div className="text-4xl mb-3">🍜</div>
              <h3 className="font-semibold mb-2">
                Trải nghiệm thú vị
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Thưởng thức ẩm thực cùng gia đình và bạn bè.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* FOOD STORY */}

      <section className="bg-orange-500 text-white py-20">

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2" className="w-full h-40 object-cover rounded-xl"/>
            <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092" className="w-full h-40 object-cover rounded-xl"/>
            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349" className="w-full h-40 object-cover rounded-xl"/>
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" className="w-full h-40 object-cover rounded-xl"/>
          </div>

          <div>

            <h2 className="text-3xl font-bold mb-4">
              Thưởng thức những món ăn tuyệt vời
            </h2>

            <p className="mb-4">
              Khám phá thế giới ẩm thực với nhiều món ăn hấp dẫn
              được chế biến từ nguyên liệu tươi ngon.
            </p>

            <p>
              Mỗi món ăn đều mang đến một trải nghiệm thú vị
              giúp bạn tận hưởng bữa ăn cùng gia đình.
            </p>

          </div>

        </div>

      </section>

       <ChatBox />
      <Footer/>

      {/* SCROLL TOP */}

      <button
        onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        className="fixed bottom-6 right-6 bg-gray-800 dark:bg-orange-500 text-white p-3 rounded-full shadow"
      >
        ↑
      </button>

    </div>

  )

}