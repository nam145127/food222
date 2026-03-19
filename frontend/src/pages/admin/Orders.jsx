import { useEffect,useState } from "react"
import api from "@/servers/api"

import {
Card,
CardHeader,
CardTitle,
CardContent
} from "@/components/ui/card"

import {
Table,
TableHeader,
TableRow,
TableHead,
TableBody,
TableCell
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import {
Select,
SelectTrigger,
SelectValue,
SelectContent,
SelectItem
} from "@/components/ui/select"

export default function AdminOrders(){

const [orders,setOrders] = useState([])
const [search,setSearch] = useState("")
const [statusFilter,setStatusFilter] = useState("all")

useEffect(()=>{
fetchOrders()
},[])

const fetchOrders = async()=>{

const res = await api.get("/orders/admin")

setOrders(res.data)

}

const updateStatus = async(code,status)=>{

await api.patch(`/orders/${code}/status`,{
status
})

fetchOrders()

}

const statusColor = {
pending:"bg-yellow-500",
confirmed:"bg-blue-500",
shipping:"bg-purple-500",
delivered:"bg-green-500",
cancelled:"bg-red-500"
}

const filtered = orders.filter(order=>{

const matchSearch =
order.order_code.toLowerCase().includes(search.toLowerCase())

const matchStatus =
statusFilter === "all" || order.status === statusFilter

return matchSearch && matchStatus

})

return(

<div className="p-6 space-y-6">

<Card>

<CardHeader>

<CardTitle>
Quản lý đơn hàng
</CardTitle>

</CardHeader>

<CardContent className="space-y-4">

<div className="flex gap-4">

<input
placeholder="Tìm mã đơn..."
value={search}
onChange={e=>setSearch(e.target.value)}
className="border px-3 py-2 rounded w-64"
/>

<Select onValueChange={setStatusFilter}>

<SelectTrigger className="w-40">
<SelectValue placeholder="Trạng thái"/>
</SelectTrigger>

<SelectContent>

<SelectItem value="all">
Tất cả
</SelectItem>

<SelectItem value="pending">
Chờ xử lý
</SelectItem>

<SelectItem value="confirmed">
Đã xác nhận
</SelectItem>

<SelectItem value="shipping">
Đang giao
</SelectItem>

<SelectItem value="delivered">
Hoàn thành
</SelectItem>

<SelectItem value="cancelled">
Đã hủy
</SelectItem>

</SelectContent>

</Select>

</div>

<Table>

<TableHeader>

<TableRow>

<TableHead>Mã đơn</TableHead>
<TableHead>Khách</TableHead>
<TableHead>Tổng tiền</TableHead>
<TableHead>Trạng thái</TableHead>
<TableHead>Ngày</TableHead>
<TableHead>Cập nhật</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{filtered.map(order=>(

<TableRow key={order.id}>

<TableCell>
{order.order_code}
</TableCell>

<TableCell>
{order.name}
</TableCell>

<TableCell>
{new Intl.NumberFormat("vi-VN").format(order.total_price)} đ
</TableCell>

<TableCell>

<Badge className={statusColor[order.status]}>
{order.status}
</Badge>

</TableCell>

<TableCell>
{new Date(order.created_at).toLocaleDateString()}
</TableCell>

<TableCell>

<Select
onValueChange={(value)=>updateStatus(order.order_code,value)}
>

<SelectTrigger className="w-36">
<SelectValue placeholder="Đổi trạng thái"/>
</SelectTrigger>

<SelectContent>

<SelectItem value="pending">
Pending
</SelectItem>

<SelectItem value="confirmed">
Confirmed
</SelectItem>

<SelectItem value="shipping">
Shipping
</SelectItem>

<SelectItem value="delivered">
Delivered
</SelectItem>

<SelectItem value="cancelled">
Cancelled
</SelectItem>

</SelectContent>

</Select>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>

</div>

)

}