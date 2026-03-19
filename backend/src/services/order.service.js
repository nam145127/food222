const db = require("../config/db")

// ==============================
// CREATE ORDER
// ==============================

exports.createOrder = async (userId, data) => {

  const conn = await db.connect()
  await conn.query("BEGIN")

  try {

    const {
      order_code,
      recipient_name,
      address,
      phone,
      payment_method,
      note
    } = data

    // ==============================
    // VALIDATE
    // ==============================

    if (!order_code) {
      throw new Error("Missing order code")
    }

    if (!recipient_name || !address || !phone) {
      throw new Error("Missing shipping information")
    }

    // ==============================
    // CHECK ORDER CODE
    // ==============================

    const exist = await conn.query(
      "SELECT id FROM orders WHERE order_code=$1",
      [order_code]
    )

    if (exist.rows.length > 0) {
      throw new Error("Order code already exists")
    }

    // ==============================
    // GET CART
    // ==============================

    const cartResult = await conn.query(`
      SELECT 
        c.food_id,
        c.quantity,
        f.price,
        f.stock,
        f.sold_count
      FROM cart_items c
      JOIN foods f ON c.food_id = f.id
      WHERE c.user_id = $1
    `, [userId])

    const cart = cartResult.rows

    if (cart.length === 0) {
      throw new Error("Cart is empty")
    }

    // ==============================
    // CALCULATE TOTAL
    // ==============================

    let total = 0

    for (const item of cart) {

      if (item.sold_count + item.quantity > item.stock) {
        throw new Error("Food out of stock")
      }

      total += item.price * item.quantity

    }

    // ==============================
    // CREATE ORDER
    // ==============================

    const orderResult = await conn.query(`
      INSERT INTO orders
      (
        order_code,
        user_id,
        recipient_name,
        total_price,
        address,
        phone,
        note,
        status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id
    `, [
      order_code,
      userId,
      recipient_name,
      total,
      address,
      phone,
      note || null,
      "pending"
    ])

    const orderId = orderResult.rows[0].id

    // ==============================
    // CREATE ORDER ITEMS
    // ==============================

    for (const item of cart) {

      await conn.query(`
        INSERT INTO order_items
        (order_id,food_id,quantity,price)
        VALUES($1,$2,$3,$4)
      `, [
        orderId,
        item.food_id,
        item.quantity,
        item.price
      ])

      await conn.query(`
        UPDATE foods
        SET sold_count = sold_count + $1
        WHERE id = $2
      `, [
        item.quantity,
        item.food_id
      ])

      await conn.query(`
        INSERT INTO inventory_logs
        (food_id,change_type,quantity,note)
        VALUES($1,'sale',$2,'Order sale')
      `, [
        item.food_id,
        item.quantity
      ])

    }

    // ==============================
    // PAYMENT RECORD
    // ==============================

    await conn.query(`
      INSERT INTO payments
      (order_id,method,amount,status)
      VALUES($1,$2,$3,'pending')
    `, [
      orderId,
      payment_method,
      total
    ])

    // ==============================
    // CLEAR CART
    // ==============================

    await conn.query(`
      DELETE FROM cart_items
      WHERE user_id = $1
    `, [userId])

    await conn.query("COMMIT")

    return {
      order_code,
      total
    }

  } catch (error) {

    await conn.query("ROLLBACK")
    throw error

  } finally {

    conn.release()

  }

}

// ==============================
// GET MY ORDERS
// ==============================

exports.getMyOrders = async (userId) => {

  const result = await db.query(
    `SELECT 
      id,
      order_code,
      total_price,
      status,
      created_at
     FROM orders
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  )

  return result.rows

}

// ==============================
// GET ORDER DETAIL
// ==============================

exports.getOrderDetail = async (code) => {

  const orders = await db.query(
    `SELECT * FROM orders WHERE order_code=$1`,
    [code]
  )

  if (orders.rows.length === 0) {
    throw new Error("Order not found")
  }

  const order = orders.rows[0]

  const itemsResult = await db.query(`
    SELECT 
      oi.id,
      oi.quantity,
      oi.price,
      f.name,
      f.image_url
    FROM order_items oi
    JOIN foods f ON oi.food_id = f.id
    WHERE oi.order_id = $1
  `, [order.id])

  order.items = itemsResult.rows

  return order

}

// ==============================
// UPDATE ORDER STATUS (ADMIN)
// ==============================

exports.updateOrderStatus = async (code, status, adminId) => {

  const orders = await db.query(
    `SELECT id FROM orders WHERE order_code=$1`,
    [code]
  )

  if (orders.rows.length === 0) {
    throw new Error("Order not found")
  }

  await db.query(
    `UPDATE orders SET status=$1 WHERE order_code=$2`,
    [status, code]
  )

  return {
    message: "Order status updated",
    status
  }

}


// ==============================
// GET ALL ORDERS
// ==============================

exports.getAllOrders = async () => {

  const result = await db.query(`
    SELECT
    orders.id,
    orders.order_code,
    users.name,
    orders.total_price,
    orders.status,
    orders.created_at
    FROM orders
    JOIN users ON users.id = orders.user_id
    ORDER BY orders.created_at DESC
  `)

  return result.rows

}