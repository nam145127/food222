import { useEffect, useState } from "react"
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

import { Button } from "@/components/ui/button"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

export default function AdminContacts() {

    const [contacts, setContacts] = useState([])
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchContacts()
    }, [])

    const fetchContacts = async () => {

        try {

            const res = await api.get("/contacts")

            setContacts(res.data)

        } catch (err) {

            console.error(err)

        }

    }

    const deleteContact = async (id) => {

        if (!confirm("Xóa liên hệ này?")) return

        await api.delete(`/contacts/${id}`)

        fetchContacts()

    }

    const openDetail = async (id) => {

        const res = await api.get(`/contacts/${id}`)

        setSelected(res.data)

        setOpen(true)

    }

    const filtered = contacts.filter(c =>

        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())

    )

    return (

        <div className="p-6 space-y-6">

            <Card>

                <CardHeader>

                    <CardTitle>
                        Quản lý liên hệ
                    </CardTitle>

                </CardHeader>

                <CardContent className="space-y-4">

                    <input
                        placeholder="Tìm theo tên hoặc email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-64"
                    />

                    <Table>

                        <TableHeader>

                            <TableRow>

                                <TableHead>ID</TableHead>
                                <TableHead>Tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Điện thoại</TableHead>
                                <TableHead>Ngày gửi</TableHead>
                                <TableHead>Hành động</TableHead>

                            </TableRow>

                        </TableHeader>

                        <TableBody>

                            {filtered.map(contact => (

                                <TableRow key={contact.id}>

                                    <TableCell>
                                        {contact.id}
                                    </TableCell>

                                    <TableCell>
                                        {contact.name}
                                    </TableCell>

                                    <TableCell>
                                        {contact.email}
                                    </TableCell>

                                    <TableCell>
                                        {contact.phone || "-"}
                                    </TableCell>

                                    <TableCell>
                                        {new Date(contact.created_at).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="flex gap-2">

                                        <Button
                                            variant="outline"
                                            onClick={() => openDetail(contact.id)}
                                        >
                                            Xem
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            onClick={() => deleteContact(contact.id)}
                                        >
                                            Xóa
                                        </Button>

                                    </TableCell>

                                </TableRow>

                            ))}

                        </TableBody>

                    </Table>

                </CardContent>

            </Card>

            {/* ================= DETAIL POPUP ================= */}

            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent>

                    <DialogHeader>

                        <DialogTitle>
                            Chi tiết liên hệ
                        </DialogTitle>

                    </DialogHeader>

                    {selected && (

                        <div className="space-y-3">

                            <p>
                                <b>Tên:</b> {selected.name}
                            </p>

                            <p>
                                <b>Email:</b> {selected.email}
                            </p>

                            <p>
                                <b>Phone:</b> {selected.phone || "-"}
                            </p>

                            <p>
                                <b>Ngày:</b> {new Date(selected.created_at).toLocaleString()}
                            </p>

                            <div>

                                <b>Nội dung:</b>

                                <p className="mt-2 bg-muted p-3 rounded">
                                    {selected.message}
                                </p>

                            </div>

                        </div>

                    )}

                </DialogContent>

            </Dialog>

        </div>

    )

}