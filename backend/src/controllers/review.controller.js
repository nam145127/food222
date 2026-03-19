const db = require("../config/db");

/*
CREATE REVIEW
*/
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { food_id, rating, comment } = req.body;

    if (!food_id || !rating) {
      return res.status(400).json({
        message: "food_id và rating là bắt buộc"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating phải từ 1 đến 5"
      });
    }

    // check user đã mua chưa
    const orderResult = await db.query(
      `SELECT oi.id
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       AND oi.food_id = $2
       AND o.status = 'delivered'
       LIMIT 1`,
      [userId, food_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(403).json({
        message: "Bạn phải mua món này trước khi đánh giá"
      });
    }

    // check đã review chưa
    const existResult = await db.query(
      `SELECT id
       FROM reviews
       WHERE user_id = $1
       AND food_id = $2`,
      [userId, food_id]
    );

    if (existResult.rows.length > 0) {
      return res.status(400).json({
        message: "Bạn đã review món này rồi"
      });
    }

    const result = await db.query(
      `INSERT INTO reviews
       (user_id, food_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, food_id, rating, comment]
    );

    res.json({
      message: "Đánh giá thành công",
      review_id: result.rows[0].id
    });

  } catch (error) {
    res.status(500).json(error);
  }
};


/*
GET REVIEWS BY FOOD
*/
exports.getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.params;

    const reviewsResult = await db.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.food_id = $1
      ORDER BY r.created_at DESC`,
      [foodId]
    );

    res.json(reviewsResult.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
GET FOOD RATING
*/
exports.getFoodRating = async (req, res) => {
  try {
    const { foodId } = req.params;

    const ratingResult = await db.query(
      `SELECT
        AVG(rating) AS avg_rating,
        COUNT(id) AS total_reviews
      FROM reviews
      WHERE food_id = $1`,
      [foodId]
    );

    res.json(ratingResult.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
GET MY REVIEWS
*/
exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const reviewsResult = await db.query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        f.name AS food_name
      FROM reviews r
      JOIN foods f ON r.food_id = f.id
      WHERE r.user_id = $1`,
      [userId]
    );

    res.json(reviewsResult.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
UPDATE REVIEW
*/
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const reviewResult = await db.query(
      `SELECT id
       FROM reviews
       WHERE id = $1
       AND user_id = $2`,
      [id, userId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(403).json({
        message: "Không có quyền sửa review này"
      });
    }

    await db.query(
      `UPDATE reviews
       SET rating = $1, comment = $2
       WHERE id = $3`,
      [rating, comment, id]
    );

    res.json({ message: "Cập nhật review thành công" });
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
DELETE REVIEW
*/
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reviewResult = await db.query(
      `SELECT id
       FROM reviews
       WHERE id = $1
       AND user_id = $2`,
      [id, userId]
    );

    if (reviewResult.rows.length === 0) {
      return res.status(403).json({
        message: "Không có quyền xóa review này"
      });
    }

    await db.query(
      `DELETE FROM reviews
       WHERE id = $1`,
      [id]
    );

    res.json({ message: "Đã xóa review" });
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
CHECK CAN REVIEW
*/
exports.canReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId } = req.params;

    const orderResult = await db.query(
      `SELECT oi.id
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       AND oi.food_id = $2
       AND o.status = 'delivered'
       LIMIT 1`,
      [userId, foodId]
    );

    res.json({ canReview: orderResult.rows.length > 0 });
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
ADMIN GET ALL REVIEWS
*/
exports.getAllReviews = async (req, res) => {
  try {
    const reviewsResult = await db.query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.name AS user_name,
        f.name AS food_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN foods f ON r.food_id = f.id
      ORDER BY r.created_at DESC`
    );

    res.json(reviewsResult.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};


/*
ADMIN DELETE REVIEW
*/
exports.adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `DELETE FROM reviews
       WHERE id = $1`,
      [id]
    );

    res.json({ message: "Admin đã xóa review" });
  } catch (error) {
    res.status(500).json(error);
  }
};