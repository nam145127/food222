import { useEffect, useState } from "react"
import api from "@/servers/api"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import {
ResponsiveContainer,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
PieChart,
Pie,
Cell,
LineChart,
Line
} from "recharts"

import {
Users,
ShoppingCart,
Utensils,
DollarSign
} from "lucide-react"

export default function AdminDashboard(){

const [data,setData] = useState(null)

useEffect(()=>{
fetchDashboard()
},[])

const fetchDashboard = async ()=>{

try{

const res = await api.get("/admin/dashboard")

setData(res.data)

}catch(err){
console.error(err)
}

}

if(!data){

return(
<div className="p-10 text-center text-gray-500">
Đang tải dữ liệu...
</div>
)

}

const {
stats,
orderStatus,
topFoods,
topRating,
recentOrders,
revenueDay,
revenueMonth,
revenueYear
} = data


const statusColors = {
pending:"bg-yellow-500",
confirmed:"bg-blue-500",
shipping:"bg-purple-500",
delivered:"bg-green-500",
cancelled:"bg-red-500"
}

const pieColors = [
"#f59e0b",
"#3b82f6",
"#a855f7",
"#10b981",
"#ef4444"
]

return(

<div className="p-6 space-y-8">

{/* ================= STATS ================= */}

<div className="grid md:grid-cols-4 gap-6">

<Card>
<CardContent className="flex items-center gap-4 p-6">
<Users className="text-blue-500"/>
<div>
<p className="text-sm text-muted-foreground">
Người dùng
</p>
<p className="text-2xl font-bold">
{stats.users}
</p>
</div>
</CardContent>
</Card>


<Card>
<CardContent className="flex items-center gap-4 p-6">
<Utensils className="text-orange-500"/>
<div>
<p className="text-sm text-muted-foreground">
Món ăn
</p>
<p className="text-2xl font-bold">
{stats.foods}
</p>
</div>
</CardContent>
</Card>


<Card>
<CardContent className="flex items-center gap-4 p-6">
<ShoppingCart className="text-purple-500"/>
<div>
<p className="text-sm text-muted-foreground">
Đơn hàng
</p>
<p className="text-2xl font-bold">
{stats.orders}
</p>
</div>
</CardContent>
</Card>


<Card>
<CardContent className="flex items-center gap-4 p-6">
<DollarSign className="text-green-500"/>
<div>
<p className="text-sm text-muted-foreground">
Doanh thu
</p>
<p className="text-2xl font-bold">
{new Intl.NumberFormat("vi-VN").format(stats.revenue)} đ
</p>
</div>
</CardContent>
</Card>

</div>


{/* ================= ORDER STATUS ================= */}

<div className="grid md:grid-cols-2 gap-6">

<Card>

<CardHeader>
<CardTitle>Đơn hàng theo trạng thái</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={orderStatus}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="status"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="total" fill="#f97316"/>

</BarChart>

</ResponsiveContainer>

</CardContent>

</Card>


<Card>

<CardHeader>
<CardTitle>Tỉ lệ trạng thái đơn</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={orderStatus}
dataKey="total"
nameKey="status"
outerRadius={100}
>

{orderStatus.map((entry,index)=>(
<Cell
key={index}
fill={pieColors[index % pieColors.length]}
/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</CardContent>

</Card>

</div>


{/* ================= REVENUE CHART ================= */}

<Card>

<CardHeader>
<CardTitle>Doanh thu theo ngày</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={revenueDay}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="date"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="total"
stroke="#22c55e"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</CardContent>

</Card>


{/* ================= TOP FOODS ================= */}

<div className="grid md:grid-cols-2 gap-6">

<Card>

<CardHeader>
<CardTitle>Món bán chạy</CardTitle>
</CardHeader>

<CardContent>

<Table>

<TableHeader>
<TableRow>
<TableHead>Món ăn</TableHead>
<TableHead>Đã bán</TableHead>
</TableRow>
</TableHeader>

<TableBody>

{topFoods.map(food=>(

<TableRow key={food.id}>

<TableCell className="flex items-center gap-3">

<img
src={food.image_url}
className="w-10 h-10 rounded object-cover"
/>

{food.name}

</TableCell>

<TableCell>
{food.sold_count}
</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>


<Card>

<CardHeader>
<CardTitle>Món đánh giá cao</CardTitle>
</CardHeader>

<CardContent>

<Table>

<TableHeader>

<TableRow>
<TableHead>Món ăn</TableHead>
<TableHead>Rating</TableHead>
</TableRow>

</TableHeader>

<TableBody>

{topRating.map(food=>(

<TableRow key={food.id}>

<TableCell className="flex items-center gap-3">

<img
src={food.image_url}
className="w-10 h-10 rounded object-cover"
/>

{food.name}

</TableCell>

<TableCell>
⭐ {food.rating}
</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>

</div>


{/* ================= RECENT ORDERS ================= */}

<Card>

<CardHeader>
<CardTitle>Đơn hàng gần đây</CardTitle>
</CardHeader>

<CardContent>

<Table>

<TableHeader>

<TableRow>
<TableHead>ID</TableHead>
<TableHead>Khách</TableHead>
<TableHead>Tổng tiền</TableHead>
<TableHead>Trạng thái</TableHead>
</TableRow>

</TableHeader>

<TableBody>

{recentOrders.map(order=>(

<TableRow key={order.id}>

<TableCell>#{order.id}</TableCell>

<TableCell>{order.name}</TableCell>

<TableCell>
{new Intl.NumberFormat("vi-VN").format(order.total_price)} đ
</TableCell>

<TableCell>

<Badge className={statusColors[order.status]}>
{order.status}
</Badge>

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