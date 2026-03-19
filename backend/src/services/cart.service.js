const db = require("../config/db")

// ======================
// GET CART
// ======================
exports.getCartByUser = async (userId) => {

  const result = await db.query(`
    SELECT 
      cart_items.id,
      cart_items.quantity,
      foods.id as food_id,
      foods.name,
      foods.price,
      foods.image_url,
      foods.price * cart_items.quantity as total
    FROM cart_items
    JOIN foods ON foods.id = cart_items.food_id
    WHERE cart_items.user_id=$1
  `,[userId])

  return result.rows

}

// ======================
// FIND ITEM
// ======================
exports.findItem = async (userId, foodId) => {

  const result = await db.query(
    "SELECT * FROM cart_items WHERE user_id=$1 AND food_id=$2",
    [userId, foodId]
  )

  return result.rows[0]

}

// ======================
// ADD ITEM
// ======================
exports.addItem = async (userId, foodId, quantity) => {

  const result = await db.query(
    "INSERT INTO cart_items(user_id,food_id,quantity) VALUES($1,$2,$3) RETURNING id",
    [userId, foodId, quantity]
  )

  return result.rows[0].id

}

// ======================
// UPDATE QUANTITY
// ======================
exports.updateQuantity = async (id, quantity) => {

  await db.query(
    "UPDATE cart_items SET quantity=$1 WHERE id=$2",
    [quantity, id]
  )

}

// ======================
// DELETE ITEM
// ======================
exports.deleteItem = async (id) => {

  await db.query(
    "DELETE FROM cart_items WHERE id=$1",
    [id]
  )

}