const Cart = require("../services/cart.service")

// ======================
// GET CART
// ======================
exports.getCart = async (req,res)=>{

  try{

    const userId = req.user.id

    const cart = await Cart.getCartByUser(userId)

    res.json(cart)

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

// ======================
// ADD TO CART
// ======================
exports.addToCart = async (req,res)=>{

  try{

    const userId = req.user.id
    const {food_id,quantity} = req.body

    const exist = await Cart.findItem(userId,food_id)

    if(exist){

      const newQty = exist.quantity + quantity

      await Cart.updateQuantity(exist.id,newQty)

    }else{

      await Cart.addItem(userId,food_id,quantity)

    }

    res.json({message:"Added to cart"})

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

// ======================
// UPDATE CART
// ======================
exports.updateCart = async (req,res)=>{

  try{

    const {id} = req.params
    const {quantity} = req.body

    await Cart.updateQuantity(id,quantity)

    res.json({message:"Cart updated"})

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}

// ======================
// DELETE CART ITEM
// ======================
exports.deleteCart = async (req,res)=>{

  try{

    const {id} = req.params

    await Cart.deleteItem(id)

    res.json({message:"Item removed"})

  }catch(err){

    console.error(err)
    res.status(500).json({message:"Server error"})

  }

}