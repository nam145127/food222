const db = require("../config/db")

// ==============================
// CREATE CONTACT
// ==============================

exports.createContact = async (data) => {

  const { name, email, phone, message } = data

  if (!name || !email || !message) {
    throw new Error("Missing required fields")
  }

  const result = await db.query(
    `INSERT INTO contacts (name,email,phone,message)
     VALUES ($1,$2,$3,$4)
     RETURNING id`,
    [
      name,
      email,
      phone || null,
      message
    ]
  )

  return {
    id: result.rows[0].id,
    name,
    email,
    phone,
    message
  }

}

// ==============================
// GET ALL CONTACTS (ADMIN)
// ==============================

exports.getAllContacts = async () => {

  const result = await db.query(
    `SELECT 
      id,
      name,
      email,
      phone,
      message,
      created_at
     FROM contacts
     ORDER BY id DESC`
  )

  return result.rows

}

// ==============================
// GET CONTACT DETAIL
// ==============================

exports.getContactDetail = async (id) => {

  const result = await db.query(
    `SELECT * FROM contacts WHERE id=$1`,
    [id]
  )

  if (result.rows.length === 0) {
    throw new Error("Contact not found")
  }

  return result.rows[0]

}

// ==============================
// DELETE CONTACT
// ==============================

exports.deleteContact = async (id) => {

  const result = await db.query(
    `DELETE FROM contacts WHERE id=$1 RETURNING id`,
    [id]
  )

  if (result.rows.length === 0) {
    throw new Error("Contact not found")
  }

  return { message: "Contact deleted" }

}