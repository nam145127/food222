const express = require("express")
const router = express.Router()

const contactController = require("../controllers/contact.controller")

const auth = require("../middleware/authMiddleware")
const role = require("../middleware/roleMiddleware")

// ==============================
// USER SEND CONTACT
// ==============================

router.post(
"/",
contactController.createContact
)

// ==============================
// ADMIN VIEW CONTACTS
// ==============================

router.get(
"/",
auth,
role("admin"),
contactController.getContacts
)

// ==============================
// CONTACT DETAIL
// ==============================

router.get(
"/:id",
auth,
role("admin"),
contactController.getContactDetail
)

// ==============================
// DELETE CONTACT
// ==============================

router.delete(
"/:id",
auth,
role("admin"),
contactController.deleteContact
)

module.exports = router