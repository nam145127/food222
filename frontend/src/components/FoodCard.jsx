import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../servers/api"
import { toast } from "sonner"

export default function FoodCard({food}){

const [open,setOpen] = useState(false)
const [qty,setQty] = useState(1)
const [loading,setLoading] = useState(false)

const addCart = async()=>{

try{

setLoading(true)

await api.post("/cart/add",{
food_id:food.id,
quantity:qty
})

toast.success("Đã thêm vào giỏ hàng 🛒")

// cập nhật badge header
window.dispatchEvent(new Event("cartUpdated"))

setOpen(false)
setQty(1)

}catch(err){

console.error(err)

if(err.response?.status===401){
toast.error("Bạn cần đăng nhập")
}else{
toast.error("Thêm giỏ hàng thất bại")
}

}finally{

setLoading(false)

}

}

return(

<>

<div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

<img
src={food.image_url}
className="w-full h-40 object-cover"
/>

<div className="p-4 space-y-2">

<h3 className="font-semibold line-clamp-1">
{food.name}
</h3>

<p className="text-orange-500 font-bold">
{new Intl.NumberFormat("vi-VN").format(food.price)} đ
</p>

<div className="flex gap-2 pt-2">

<button
onClick={()=>setOpen(true)}
className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
>
Thêm vào giỏ
</button>

<Link
to={`/foods/${food.id}`}
className="flex-1 border text-center py-2 rounded hover:bg-gray-100"
>
Xem thêm
</Link>

</div>

</div>

</div>



{/* MODAL */}

{open &&(

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-xl p-6 w-80">

<h2 className="text-lg font-semibold mb-4">
Chọn số lượng
</h2>


{/* QUANTITY */}

<div className="flex items-center justify-center gap-4 mb-6">

<button
onClick={()=>qty>1 && setQty(qty-1)}
className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
>
-
</button>

<span className="text-lg font-semibold">
{qty}
</span>

<button
onClick={()=>setQty(qty+1)}
className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
>
+
</button>

</div>



{/* ACTIONS */}

<div className="flex gap-3">

<button
onClick={()=>setOpen(false)}
className="flex-1 border py-2 rounded"
>
Hủy
</button>

<button
onClick={addCart}
disabled={loading}
className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
>

{loading ? "Đang thêm..." : "Thêm"}

</button>

</div>

</div>

</div>

)}

</>

)

}