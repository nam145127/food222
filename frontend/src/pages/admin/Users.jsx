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

export default function Users() {

  const [users, setUsers] = useState([])

  // ===============================
  // GET USERS
  // ===============================
  const fetchUsers = async () => {

    try {

      const res = await api.get("/admin/users")

      setUsers(res.data.data || [])

    } catch (err) {

      console.error(err)
      toast.error("Không tải được danh sách user")

    }

  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // ===============================
  // LOCK / UNLOCK USER
  // ===============================
  const toggleStatus = async (user) => {

    try {

      await api.patch(`/admin/users/${user.id}/status`, {
        is_active: user.is_active ? 0 : 1
      })

      toast.success("Cập nhật trạng thái thành công")

      fetchUsers()

    } catch {

      toast.error("Lỗi cập nhật trạng thái")

    }

  }

  // ===============================
  // UPDATE ROLE
  // ===============================
  const updateRole = async (user, role) => {

    if (!window.confirm("Đổi role của user này?")) return

    try {

      await api.patch(`/admin/users/${user.id}/role`, { role })

      toast.success("Cập nhật role thành công")

      fetchUsers()

    } catch {

      toast.error("Không thể cập nhật role")

    }

  }

  // ===============================
  // DELETE USER
  // ===============================
  const deleteUser = async (id) => {

    if (!window.confirm("Xóa user này?")) return

    try {

      await api.delete(`/admin/users/${id}`)

      toast.success("Đã xóa user")

      fetchUsers()

    } catch {

      toast.error("Không thể xóa user")

    }

  }

  return (

    <div className="p-6">

      <Card>

        <CardHeader>

          <CardTitle>
            Quản lý người dùng
          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b border-border bg-muted/40">

                <tr>

                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Tên</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Trạng thái</th>
                  <th className="text-right p-3">Hành động</th>

                </tr>

              </thead>

              <tbody>

                {users.length === 0 && (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center p-6 text-muted-foreground"
                    >
                      Không có dữ liệu
                    </td>

                  </tr>

                )}

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b border-border hover:bg-accent/40 transition"
                  >

                    <td className="p-3">
                      {user.id}
                    </td>

                    <td className="p-3 font-medium">
                      {user.name}
                    </td>

                    <td className="p-3">
                      {user.email}
                    </td>

                    <td className="p-3">
                      {user.phone || "-"}
                    </td>

                    {/* ROLE */}
                    <td className="p-3">

                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateRole(user, e.target.value)
                        }
                        className="
                          bg-card
                          text-foreground
                          border
                          border-border
                          rounded-md
                          px-2
                          py-1
                          text-sm

                         cursor-pointer
                        "
                      >

                        <option value="user">
                          User
                        </option>

                        <option value="staff">
                          Staff
                        </option>

                      </select>

                    </td>

                    {/* STATUS */}
                    <td className="p-3">

                      {user.is_active ? (

                        <span className="text-green-500 font-medium">
                          Hoạt động
                        </span>

                      ) : (

                        <span className="text-red-500 font-medium">
                          Bị khóa
                        </span>

                      )}

                    </td>

                    {/* ACTION */}
                    <td className="p-3 text-right space-x-2">

                      <Button
                      className="cursor-pointer"
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(user)}
                      >

                        {user.is_active
                          ? "Khóa"
                          : "Mở"}

                      </Button>

                      <Button
                      className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
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