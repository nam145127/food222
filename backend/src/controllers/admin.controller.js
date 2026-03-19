const db = require("../config/db")

exports.dashboard = async (req, res) => {
  try {

    // ============================
    // BASIC STATS
    // ============================

    const usersResult = await db.query("SELECT COUNT(*) AS total FROM users")
    const foodsResult = await db.query("SELECT COUNT(*) AS total FROM foods")
    const ordersResult = await db.query("SELECT COUNT(*) AS total FROM orders")
    const revenueResult = await db.query(`
      SELECT COALESCE(SUM(total_price),0) AS total 
      FROM orders 
      WHERE status='delivered'
    `)

    const users = usersResult.rows[0]
    const foods = foodsResult.rows[0]
    const orders = ordersResult.rows[0]
    const revenue = revenueResult.rows[0]

    // ============================
    // ORDER STATUS
    // ============================

    const orderStatusResult = await db.query(`
      SELECT status, COUNT(*) AS total
      FROM orders
      GROUP BY status
    `)
    const orderStatus = orderStatusResult.rows

    // ============================
    // TOP FOODS
    // ============================

    const topFoodsResult = await db.query(`
      SELECT id, name, image_url, sold_count
      FROM foods
      ORDER BY sold_count DESC
      LIMIT 5
    `)
    const topFoods = topFoodsResult.rows

    // ============================
    // TOP RATING
    // ============================

    const topRatingResult = await db.query(`
      SELECT 
        foods.id,
        foods.name,
        foods.image_url,
        ROUND(AVG(reviews.rating)::numeric, 1) AS rating
      FROM reviews
      JOIN foods ON foods.id = reviews.food_id
      GROUP BY foods.id
      ORDER BY rating DESC
      LIMIT 5
    `)
    const topRating = topRatingResult.rows

    // ============================
    // RECENT ORDERS
    // ============================

    const recentOrdersResult = await db.query(`
      SELECT 
        orders.id,
        users.name,
        orders.total_price,
        orders.status,
        orders.created_at
      FROM orders
      JOIN users ON users.id = orders.user_id
      ORDER BY orders.created_at DESC
      LIMIT 5
    `)
    const recentOrders = recentOrdersResult.rows

    // ============================
    // REVENUE BY DAY
    // ============================

    const revenueDayResult = await db.query(`
      SELECT 
        DATE(created_at) AS date,
        SUM(total_price) AS total
      FROM orders
      WHERE status='delivered'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)
    const revenueDay = revenueDayResult.rows

    // ============================
    // REVENUE BY MONTH
    // ============================

    const revenueMonthResult = await db.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        SUM(total_price) AS total
      FROM orders
      WHERE status='delivered'
      GROUP BY month
      ORDER BY month ASC
    `)
    const revenueMonth = revenueMonthResult.rows

    // ============================
    // REVENUE BY YEAR
    // ============================

    const revenueYearResult = await db.query(`
      SELECT 
        EXTRACT(YEAR FROM created_at) AS year,
        SUM(total_price) AS total
      FROM orders
      WHERE status='delivered'
      GROUP BY year
      ORDER BY year ASC
    `)
    const revenueYear = revenueYearResult.rows

    // ============================
    // RESPONSE
    // ============================

    res.json({
      stats: {
        users: users.total,
        foods: foods.total,
        orders: orders.total,
        revenue: revenue.total
      },
      orderStatus,
      topFoods,
      topRating,
      recentOrders,
      revenueDay,
      revenueMonth,
      revenueYear
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Dashboard error" })
  }
}