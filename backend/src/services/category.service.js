const db = require("../config/db");

exports.getCategories = async () => {

  const result = await db.query("SELECT * FROM categories");

  return result.rows;

};

exports.getCategoryById = async (id) => {

  const result = await db.query(
    "SELECT * FROM categories WHERE id=$1",
    [id]
  );

  return result.rows[0];

};

exports.createCategory = async (data) => {

  const { name, description, image } = data;

  const result = await db.query(
    "INSERT INTO categories(name,description,image) VALUES($1,$2,$3) RETURNING id",
    [name, description, image]
  );

  return {
    id: result.rows[0].id,
    name,
    description,
    image
  };

};

exports.updateCategory = async (id, data) => {

  const { name, description, image } = data;

  if (image) {

    await db.query(
      "UPDATE categories SET name=$1, description=$2, image=$3 WHERE id=$4",
      [name, description, image, id]
    );

  } else {

    await db.query(
      "UPDATE categories SET name=$1, description=$2 WHERE id=$3",
      [name, description, id]
    );

  }

  return { message: "Category updated" };

};

exports.deleteCategory = async (id) => {

  await db.query(
    "DELETE FROM categories WHERE id=$1",
    [id]
  );

};