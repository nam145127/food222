import { createContext, useContext, useState } from "react"
import api from "../servers/api"

const CartContext = createContext()

export const CartProvider = ({children})=>{

const [cartCount,setCartCount] = useState(0)

const fetchCart = async()=>{

  try{

    const res = await api.get("/cart")

    const total = res.data.reduce(
      (sum,item)=>sum + item.quantity,
      0
    )

    setCartCount(total)

  }catch(err){

    console.log(err)

  }

}

return(

<CartContext.Provider
value={{
cartCount,
setCartCount,
fetchCart
}}
>

{children}

</CartContext.Provider>

)

}

export const useCart = ()=> useContext(CartContext)