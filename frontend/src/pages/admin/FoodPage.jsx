import { useEffect, useState } from "react"
import api from "../../servers/api"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export default function Foods() {

  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [categoryId, setCategoryId] = useState("")

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  const [editingId, setEditingId] = useState(null)

  // ===============================
  // GET FOODS
  // ===============================
  const fetchFoods = async () => {

    try {

      const res = await api.get("/foods?admin=true")
      setFoods(res.data || [])

    } catch (err) {

      console.error(err)
      toast.error("Không tải được món ăn")

    }

  }

  // ===============================
  // GET CATEGORIES
  // ===============================
  const fetchCategories = async () => {

    try {

      const res = await api.get("/categories")
      setCategories(res.data || [])

    } catch (err) {

      console.error(err)
      toast.error("Không tải được danh mục")

    }

  }

  useEffect(() => {

    fetchFoods()
    fetchCategories()

  }, [])

  // ===============================
  // IMAGE
  // ===============================
  const handleImage = (e) => {

    const file = e.target.files[0]

    if (file) {

      setImage(file)
      setPreview(URL.createObjectURL(file))

    }

  }

  // ===============================
  // CREATE / UPDATE
  // ===============================
  const handleSubmit = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("stock", stock)
    formData.append("category_id", categoryId)

    if (image) {

      formData.append("image", image)

    } else if (editingId && currentImage) {

      formData.append("image_url", currentImage)

    }

    try {

      if (editingId) {

        await api.put(`/foods/${editingId}`, formData)

        toast.success("Cập nhật món thành công")

      } else {

        await api.post("/foods", formData)

        toast.success("Thêm món thành công")

      }

      resetForm()
      fetchFoods()

    } catch (err) {

      console.error(err)
      toast.error("Lỗi thao tác")

    }

  }

  // ===============================
  // RESET
  // ===============================
  const resetForm = () => {

    setName("")
    setDescription("")
    setPrice("")
    setStock("")
    setCategoryId("")

    setImage(null)
    setPreview(null)
    setCurrentImage(null)

    setEditingId(null)

    const fileInput = document.getElementById("foodImage")
    if (fileInput) fileInput.value = ""

  }

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (food) => {

    setName(food.name)
    setDescription(food.description)
    setPrice(food.price)
    setStock(food.stock)
    setCategoryId(food.category_id)

    setPreview(food.image_url)
    setCurrentImage(food.image_url)

    setEditingId(food.id)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })

  }

  // ===============================
  // DELETE
  // ===============================
  const deleteFood = async (id) => {

    if (!window.confirm("Xóa món này?")) return

    try {

      await api.delete(`/foods/${id}`)

      toast.success("Đã xóa món")

      fetchFoods()

    } catch (err) {

      console.error(err)
      toast.error("Không thể xóa")

    }

  }

  return (

    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* FORM */}

      <Card>

        <CardHeader>
          <CardTitle>
            {editingId ? "Cập nhật món ăn" : "Thêm món ăn"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-4"
          >

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Tên món"
              className="border rounded-md px-3 py-2"
              required
            />

            <input
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
              placeholder="Giá"
              type="number"
              className="border rounded-md px-3 py-2"
            />

            <input
              value={stock}
              onChange={(e)=>setStock(e.target.value)}
              placeholder="Tồn kho"
              type="number"
              className="border rounded-md px-3 py-2"
            />

            <select
              value={categoryId}
              onChange={(e)=>setCategoryId(e.target.value)}
              className="border rounded-md px-3 py-2"
            >

              <option value="">
                Chọn danh mục
              </option>

              {categories.map(cat => (

                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>

              ))}

            </select>

            <input
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Mô tả"
              className="border rounded-md px-3 py-2"
            />

            {/* IMAGE */}

            <div className="flex items-center gap-3">

              <input
                type="file"
                hidden
                id="foodImage"
                onChange={handleImage}
              />

              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={()=>document.getElementById("foodImage").click()}
              >
                Chọn ảnh
              </Button>

              {preview && (

                <img
                  src={preview}
                  className="w-14 h-14 object-cover rounded-md border"
                />

              )}

            </div>

            <Button className="md:col-span-3 cursor-pointer">

              {editingId
                ? "Cập nhật"
                : "Thêm món"}

            </Button>

          </form>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card>

        <CardHeader>
          <CardTitle>
            Danh sách món ăn
          </CardTitle>
        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-muted/40 border-b">

                <tr>

                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Ảnh</th>
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Danh mục</th>
                  <th className="p-3 text-left">Giá</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-right">Hành động</th>

                </tr>

              </thead>

              <tbody>

                {foods.map(food => (

                  <tr
                    key={food.id}
                    className="border-b hover:bg-muted/30"
                  >

                    <td className="p-3">{food.id}</td>

                    <td className="p-3">

                      {food.image_url && (

                        <img
                          src={food.image_url}
                          className="w-12 h-12 rounded object-cover"
                        />

                      )}

                    </td>

                    <td className="p-3 font-medium">
                      {food.name}
                    </td>

                    <td className="p-3">
                      {food.category_name}
                    </td>

                    <td className="p-3">
                      {new Intl.NumberFormat("vi-VN").format(food.price)} đ
                    </td>

                    <td className="p-3">
                      {food.stock}
                    </td>

                    <td className="p-3 text-right space-x-2">

                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={()=>handleEdit(food)}
                      >
                        Sửa
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={()=>deleteFood(food.id)}
                      >
                        Xóa
                      </Button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>

  )

}