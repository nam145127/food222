import { useState, useEffect, useRef } from "react"
import { MessageCircle, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import api from "../servers/api"

export default function ChatBox() {

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [open, setOpen] = useState(false)

    const bottomRef = useRef(null)
    const navigate = useNavigate()

    // auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // first message
    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([
                {
                    sender: "bot",
                    text: "Xin chào 👋 tôi có thể giúp bạn tìm món ăn"
                }
            ])
        }
    }, [open])

    const sendMessage = async () => {

        if (!input.trim()) return

        const userMsg = {
            sender: "user",
            text: input
        }

        setMessages(prev => [...prev, userMsg])
        setInput("")

        try {

            const res = await api.post("/chat", { message: input })

            const botMsg = {
                sender: "bot",
                text: res.data.text,
                foods: res.data.foods,
                suggestions: res.data.suggestions
            }

            setMessages(prev => [...prev, botMsg])

        } catch (err) {

            setMessages(prev => [
                ...prev,
                {
                    sender: "bot",
                    text: "Xin lỗi, AI đang gặp lỗi"
                }
            ])

        }

    }

    return (

        <>
            {/* BUTTON */}
            <button
                onClick={() => setOpen(!open)}
                style={styles.button}
            >
                {open ? <X /> : <MessageCircle />}
            </button>


            {/* CHAT BOX */}
            {open && (

                <div style={styles.container}>

                    <div style={styles.header}>
                        FoodShop AI
                    </div>


                    <div style={styles.chat}>

                        {messages.map((m, i) => (

                            <div key={i} style={{ display: "flex", flexDirection: "column" }}>

                                {/* MESSAGE */}
                                <div
                                    style={{
                                        ...styles.msg,
                                        alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                                        background: m.sender === "user" ? "#ff6b35" : "#eee",
                                        color: m.sender === "user" ? "#fff" : "#000"
                                    }}
                                >
                                    {m.text}
                                </div>


                                {/* FOOD LIST */}
                                {m.foods && m.foods.map(food => (

                                    <div
                                        key={food.id}
                                        style={styles.foodCard}
                                        onClick={() => navigate(`/foods/${food.id}`)}
                                    >

                                        <img
                                            src={food.image_url}
                                            style={styles.foodImg}
                                        />

                                        <div>
                                            <b>{food.name}</b>

                                            <p>
                                                {new Intl.NumberFormat("vi-VN").format(food.price)} đ
                                            </p>
                                        </div>

                                    </div>

                                ))}


                                {/* SUGGESTIONS */}
                                {m.suggestions && (

                                    <div style={styles.suggestBox}>

                                        {m.suggestions.map((s, i) => (

                                            <button
                                                key={i}
                                                style={styles.suggestBtn}
                                                onClick={() => setInput(s)}
                                            >
                                                {s}
                                            </button>

                                        ))}

                                    </div>

                                )}

                            </div>

                        ))}

                        <div ref={bottomRef}></div>

                    </div>


                    {/* INPUT */}
                    <div style={styles.inputBox}>

                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Hỏi món ăn..."
                            style={styles.input}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage()
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            style={styles.send}
                        >
                            Gửi
                        </button>

                    </div>

                </div>

            )}

        </>
    )

}

const styles = {

   button: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    zIndex: 1000,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
},
    container: {
        position: "fixed",
        bottom: "150px",
        right: "20px",
        width: "330px",
        height: "450px",
        background: "#fff",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        zIndex: 1000
    },

    header: {
        padding: "10px",
        background: "#ff6b35",
        color: "#fff",
        fontWeight: "bold"
    },

    chat: {
        flex: 1,
        overflowY: "auto",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    },

    msg: {
        padding: "8px",
        borderRadius: "8px",
        maxWidth: "70%"
    },

    foodCard: {
        display: "flex",
        gap: "10px",
        background: "#fafafa",
        padding: "8px",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "6px"
    },

    foodImg: {
        width: "60px",
        height: "60px",
        objectFit: "cover",
        borderRadius: "6px"
    },

    inputBox: {
        display: "flex",
        borderTop: "1px solid #eee"
    },

    input: {
        flex: 1,
        padding: "10px",
        border: "none",
        outline: "none"
    },

    send: {
        background: "#ff6b35",
        color: "#fff",
        border: "none",
        padding: "10px",
        cursor: "pointer"
    },

    suggestBox: {
        display: "flex",
        gap: "5px",
        flexWrap: "wrap",
        marginBottom: "6px"
    },

    suggestBtn: {
        background: "#eee",
        border: "none",
        padding: "5px 8px",
        borderRadius: "5px",
        cursor: "pointer"
    }

}