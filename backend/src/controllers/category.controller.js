const categoryService = require("../services/category.service");

// ===============================
// GET ALL CATEGORIES
// ===============================
exports.getCategories = async (req, res) => {

  try {

    const categories = await categoryService.getCategories()

    res.json(categories)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// ===============================
// GET CATEGORY BY ID
// ===============================
exports.getCategoryById = async (req, res) => {

  try {

    const category = await categoryService.getCategoryById(req.params.id)

    if (!category) {

      return res.status(404).json({
        message: "Category not found"
      })

    }

    res.json(category)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// ===============================
// CREATE CATEGORY
// ===============================
exports.createCategory = async (req, res) => {

  try {

    let image = null

    if (req.file) {
      image = req.file.path
    }

    const data = {
      name: req.body.name,
      description: req.body.description,
      image: image
    }

    const category = await categoryService.createCategory(data)

    res.json(category)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// ===============================
// UPDATE CATEGORY
// ===============================
exports.updateCategory = async (req, res) => {

  try {

    const data = {
      name: req.body.name,
      description: req.body.description
    }

    if (req.file) {
      data.image = req.file.path
    }

    const category = await categoryService.updateCategory(
      req.params.id,
      data
    )

    res.json(category)

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}

// ===============================
// DELETE CATEGORY
// ===============================
exports.deleteCategory = async (req, res) => {

  try {

    await categoryService.deleteCategory(req.params.id)

    res.json({
      message: "Category deleted"
    })

  } catch (error) {

    res.status(500).json({
      message: error.message
    })

  }

}