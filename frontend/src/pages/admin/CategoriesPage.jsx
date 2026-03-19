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

export default function Categories() {

  const [categories, setCategories] = useState([])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  const [editingId, setEditingId] = useState(null)

  // ===============================
  // GET CATEGORIES
  // ===============================
  const fetchCategories = async () => {

    try {

      const res = await api.get("/categories")
      setCategories(res.data || [])

    } catch {

      toast.error("Không tải được danh mục")

    }

  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // ===============================
  // IMAGE CHANGE
  // ===============================
  const handleImageChange = (e) => {

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

    // chỉ gửi ảnh nếu có ảnh mới
    if (image) {
      formData.append("image", image)
    }

    try {

      if (editingId) {

        await api.put(`/categories/${editingId}`, formData)

        toast.success("Cập nhật danh mục thành công")

      } else {

        await api.post("/categories", formData)

        toast.success("Thêm danh mục thành công")

      }

      resetForm()
      fetchCategories()

    } catch {

      toast.error("Lỗi thao tác")

    }

  }

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {

    setName("")
    setDescription("")
    setImage(null)
    setPreview(null)
    setCurrentImage(null)
    setEditingId(null)

    const fileInput = document.getElementById("imageUpload")
    if (fileInput) fileInput.value = ""

  }

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (cat) => {

    setName(cat.name)
    setDescription(cat.description)

    setPreview(cat.image)
    setCurrentImage(cat.image)

    setImage(null) // rất quan trọng

    setEditingId(cat.id)

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })

  }

  // ===============================
  // DELETE
  // ===============================
  const deleteCategory = async (id) => {

    if (!window.confirm("Xóa danh mục này?")) return

    try {

      await api.delete(`/categories/${id}`)

      toast.success("Đã xóa danh mục")

      fetchCategories()

    } catch {

      toast.error("Không thể xóa")

    }

  }

  return (

    <div className="p-6 space-y-6 max-w-6xl mx-auto">

      {/* FORM */}

      <Card>

        <CardHeader>
          <CardTitle>
            {editingId
              ? "Cập nhật danh mục"
              : "Thêm danh mục"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-4 gap-4 items-center"
          >

            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Tên danh mục"
              className="border rounded-md px-3 py-2 w-full"
              required
            />

            <input
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Mô tả"
              className="border rounded-md px-3 py-2 w-full"
            />

            {/* IMAGE */}

            <div className="flex items-center gap-3">

              <input
                type="file"
                id="imageUpload"
                hidden
                onChange={handleImageChange}
              />

              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={()=>document.getElementById("imageUpload").click()}
              >
                Chọn ảnh
              </Button>

              {preview && (

                <img
                  src={preview}
                  className="w-14 h-14 rounded-md object-cover border"
                />

              )}

            </div>

            <Button className="cursor-pointer w-full">

              {editingId
                ? "Cập nhật"
                : "Thêm"}

            </Button>

          </form>

        </CardContent>

      </Card>


      {/* TABLE */}

      <Card>

        <CardHeader>

          <CardTitle>
            Danh sách danh mục
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-muted/50 border-b">

                <tr>

                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Ảnh</th>
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Mô tả</th>
                  <th className="p-3 text-right">Hành động</th>

                </tr>

              </thead>

              <tbody>

                {categories.length === 0 && (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-10 text-muted-foreground"
                    >
                      Không có danh mục
                    </td>

                  </tr>

                )}

                {categories.map((cat)=> (

                  <tr
                    key={cat.id}
                    className="border-b hover:bg-muted/30"
                  >

                    <td className="p-3">
                      {cat.id}
                    </td>

                    <td className="p-3">

                      {cat.image && (

                        <img
                          src={cat.image}
                          className="w-12 h-12 rounded-md object-cover"
                        />

                      )}

                    </td>

                    <td className="p-3 font-medium">
                      {cat.name}
                    </td>

                    <td className="p-3 text-muted-foreground">
                      {cat.description}
                    </td>

                    <td className="p-3 text-right space-x-2">

                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={()=>handleEdit(cat)}
                      >
                        Sửa
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={()=>deleteCategory(cat.id)}
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