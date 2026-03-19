const db = require("../config/db");

exports.getFoods = async (query) => {

  let sql = `
  SELECT foods.*, categories.name as category_name
  FROM foods
  LEFT JOIN categories
  ON foods.category_id = categories.id
  WHERE 1=1
  `;

  const params = [];
  let index = 1; // dùng cho $1, $2,...

  // =========================
  // FILTER CATEGORY
  // =========================
  if (query.category_id) {
    sql += ` AND foods.category_id=$${index++}`;
    params.push(query.category_id);
  }

  // =========================
  // SEARCH
  // =========================
  if (query.search) {
    sql += ` AND foods.name ILIKE $${index++}`;
    params.push(`%${query.search}%`);
  }

  // =========================
  // SORT
  // =========================
  if (query.sort === "price_asc") {
    sql += " ORDER BY foods.price ASC";
  }

  if (query.sort === "price_desc") {
    sql += " ORDER BY foods.price DESC";
  }

  // =========================
  // ADMIN -> lấy toàn bộ
  // =========================
  if (query.admin === "true") {

    const result = await db.query(sql, params);
    return result.rows;

  }

  // =========================
  // USER -> pagination
  // =========================
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 8;
  const offset = (page - 1) * limit;

  sql += ` LIMIT $${index++} OFFSET $${index++}`;
  params.push(limit, offset);

  const result = await db.query(sql, params);

  return result.rows;

};


// ======================================
// GET FOOD BY ID
// ======================================
exports.getFoodById = async (id) => {

  const result = await db.query(
    "SELECT * FROM foods WHERE id=$1",
    [id]
  );

  return result.rows[0];

};


// ======================================
// CREATE FOOD
// ======================================
exports.createFood = async (data) => {

  const { name, description, price, category_id, image_url, stock } = data;

  const result = await db.query(
    `INSERT INTO foods(name,description,price,category_id,image_url,stock)
     VALUES($1,$2,$3,$4,$5,$6)
     RETURNING id`,
    [name, description, price, category_id, image_url, stock]
  );

  return {
    id: result.rows[0].id,
    name,
    price
  };

};


// ======================================
// UPDATE FOOD
// ======================================
exports.updateFood = async (id, data) => {

  const { name, description, price, category_id, image_url, stock } = data;

  await db.query(
    `UPDATE foods 
     SET name=$1,description=$2,price=$3,category_id=$4,image_url=$5,stock=$6 
     WHERE id=$7`,
    [name, description, price, category_id, image_url, stock, id]
  );

  return { message: "Food updated" };

};


// ======================================
// DELETE FOOD
// ======================================
exports.deleteFood = async (id) => {

  await db.query(
    "DELETE FROM foods WHERE id=$1",
    [id]
  );

  return { message: "Food deleted" };

};