const db = require("../config/db");

exports.chatBot = async (message) => {

  const msg = message.toLowerCase();

  // ===============================
  // MENU
  // ===============================

  if (msg.includes("menu") || msg.includes("ăn gì")) {

    const foodsResult = await db.query(`
      SELECT id,name,price,image_url
      FROM foods
      LIMIT 6
    `);

    return {
      text: "Menu hôm nay:",
      foods: foodsResult.rows
    };

  }

  // ===============================
  // CATEGORY (pizza burger)
  // ===============================

  const categoryResult = await db.query(`
    SELECT id,name FROM categories
  `);

  for (let c of categoryResult.rows) {

    if (msg.includes(c.name.toLowerCase())) {

      const foodsResult = await db.query(`
        SELECT id,name,price,image_url
        FROM foods
        WHERE category_id = $1
      `,[c.id]);

      return {
        text:`Các món ${c.name}:`,
        foods: foodsResult.rows
      };

    }

  }

  // ===============================
  // MÓN RẺ
  // ===============================

  if (msg.includes("rẻ")) {

    const foodsResult = await db.query(`
      SELECT id,name,price,image_url
      FROM foods
      ORDER BY price ASC
      LIMIT 6
    `);

    return {
      text:"Các món rẻ nhất:",
      foods: foodsResult.rows
    };

  }

  // ===============================
  // MÓN BÁN CHẠY
  // ===============================

  if (msg.includes("bán chạy") || msg.includes("hot")) {

    const foodsResult = await db.query(`
      SELECT id,name,price,image_url
      FROM foods
      ORDER BY sold_count DESC
      LIMIT 6
    `);

    return {
      text:"Món bán chạy:",
      foods: foodsResult.rows
    };

  }

  // ===============================
  // GIẢM GIÁ
  // ===============================

  if (msg.includes("giảm") || msg.includes("sale")) {

    const foodsResult = await db.query(`
      SELECT id,name,price,image_url,discount
      FROM foods
      WHERE discount > 0
    `);

    return {
      text:"Món đang giảm giá:",
      foods: foodsResult.rows
    };

  }

  // ===============================
  // GIÁ
  // ===============================

  const priceMatch = msg.match(/(\d+)/);

  if (msg.includes("dưới") && priceMatch) {

    const price = parseInt(priceMatch[1]);

    const foodsResult = await db.query(`
      SELECT id,name,price,image_url
      FROM foods
      WHERE price <= $1
    `,[price]);

    return {
      text:`Món dưới ${price}đ`,
      foods: foodsResult.rows
    };

  }

  // ===============================
  // SEARCH FOOD
  // ===============================

  const foodsResult = await db.query(`
    SELECT id,name,price,image_url
    FROM foods
  `);

  const results = foodsResult.rows.filter(f =>
    msg.includes(f.name.toLowerCase())
  );

  if(results.length){

    return {
      text:"Tôi tìm thấy:",
      foods:results
    };

  }

  // ===============================
  // DEFAULT
  // ===============================

  return {

    text:"Xin chào 👋 bạn muốn ăn gì?",

    suggestions:[
      "món rẻ",
      "món bán chạy",
      "menu"
    ]

  };

};