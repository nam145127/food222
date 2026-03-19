const contactService = require("../services/contact.service")

// ==============================
// CREATE CONTACT
// ==============================

exports.createContact = async (req,res)=>{

  try{

    const contact = await contactService.createContact(req.body)

    res.json({
      message:"Contact sent successfully",
      data:contact
    })

  }catch(err){

    res.status(400).json({message:err.message})

  }

}

// ==============================
// GET CONTACTS (ADMIN)
// ==============================

exports.getContacts = async (req,res)=>{

  try{

    const contacts = await contactService.getAllContacts()

    res.json(contacts)

  }catch(err){

    res.status(500).json({message:err.message})

  }

}

// ==============================
// GET CONTACT DETAIL
// ==============================

exports.getContactDetail = async (req,res)=>{

  try{

    const contact = await contactService.getContactDetail(req.params.id)

    res.json(contact)

  }catch(err){

    res.status(404).json({message:err.message})

  }

}

// ==============================
// DELETE CONTACT
// ==============================

exports.deleteContact = async (req,res)=>{

  try{

    const result = await contactService.deleteContact(req.params.id)

    res.json(result)

  }catch(err){

    res.status(404).json({message:err.message})

  }

}