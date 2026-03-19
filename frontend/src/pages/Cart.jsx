import Header from "@/components/Header"
import Footer from "@/components/Footer"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../servers/api"
import { toast } from "sonner"

export default function Cart(){

const [cart,setCart] = useState([])
const [loading,setLoading] = useState(true)

const navigate = useNavigate()


// ======================
// FETCH CART
// ======================

const fetchCart = async()=>{

try{

const res = await api.get("/cart")
setCart(res.data)

}catch(err){

console.error(err)
toast.error("Không tải được giỏ hàng")

}finally{

setLoading(false)

}

}


// ======================
// UPDATE QUANTITY
// ======================

const updateQty = async(id,quantity)=>{

try{

await api.put(`/cart/${id}`,{quantity})

setCart(prev =>
prev.map(item =>
item.id===id
? {...item,quantity,total:item.price*quantity}
: item
)
)

}catch(err){

console.error(err)
toast.error("Cập nhật thất bại")

}

}


// ======================
// DELETE ITEM
// ======================

const removeItem = async(id)=>{

try{

await api.delete(`/cart/${id}`)

setCart(prev => prev.filter(i=>i.id!==id))

toast.success("Đã xóa món")

}catch(err){

console.error(err)
toast.error("Xóa thất bại")

}

}

useEffect(()=>{

fetchCart()

},[])


// ======================
// TOTAL
// ======================

const total = cart.reduce((sum,item)=>sum + item.total,0)


// ======================
// LOADING
// ======================

if(loading){

return(

<div className="min-h-screen flex flex-col">

<Header/>

<div className="flex-1 flex items-center justify-center text-gray-500">
Đang tải giỏ hàng...
</div>

<Footer/>

</div>

)

}


// ======================
// CHECKOUT
// ======================

const handleCheckout = ()=>{

if(cart.length===0){
toast.error("Giỏ hàng trống")
return
}

navigate("/checkout")

}


// ======================
// UI
// ======================

return(

<div className="min-h-screen flex flex-col bg-gray-100">

<Header/>

<div className="flex-1 max-w-6xl mx-auto p-6">

<h1 className="text-3xl font-bold mb-8">
🛒 Giỏ hàng của bạn
</h1>


{cart.length===0 &&(

<div className="text-center text-gray-500 py-20">
Giỏ hàng trống
</div>

)}


<div className="grid md:grid-cols-3 gap-8">


{/* CART ITEMS */}

<div className="md:col-span-2 space-y-4">

{cart.map(item=>(

<div
key={item.id}
className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-4"
>

<img
src={item.image_url}
className="w-24 h-24 object-cover rounded-lg"
/>


<div className="flex-1">

<h3 className="font-semibold text-lg">
{item.name}
</h3>

<p className="text-orange-500 font-bold">
{new Intl.NumberFormat("vi-VN").format(item.price)} đ
</p>

</div>


{/* QUANTITY */}

<div className="flex items-center gap-3">

<button
onClick={()=>item.quantity>1 && updateQty(item.id,item.quantity-1)}
className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
>
-
</button>

<span className="font-semibold">
{item.quantity}
</span>

<button
onClick={()=>updateQty(item.id,item.quantity+1)}
className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100"
>
+
</button>

</div>


{/* TOTAL */}

<div className="w-28 text-right font-semibold">

{new Intl.NumberFormat("vi-VN").format(item.total)} đ

</div>


<button
onClick={()=>removeItem(item.id)}
className="text-red-500 hover:text-red-700 text-sm"
>
Xóa
</button>

</div>

))}

</div>



{/* CHECKOUT BOX */}

{cart.length>0 &&(

<div className="bg-white p-6 rounded-xl shadow h-fit">

<h2 className="text-xl font-semibold mb-4">
Tổng đơn hàng
</h2>

<div className="flex justify-between mb-2 text-gray-600">
<span>Tạm tính</span>
<span>
{new Intl.NumberFormat("vi-VN").format(total)} đ
</span>
</div>

<div className="flex justify-between mb-4 text-gray-600">
<span>Phí giao hàng</span>
<span>0 đ</span>
</div>

<hr className="mb-4"/>

<div className="flex justify-between text-lg font-bold mb-6">

<span>Tổng</span>

<span className="text-orange-500">
{new Intl.NumberFormat("vi-VN").format(total)} đ
</span>

</div>


<button
onClick={handleCheckout}
className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
>
Thanh toán
</button>

</div>

)}

</div>

</div>

<Footer/>

</div>

)

}