const foodService = require("../services/food.service");

exports.getFoods = async (req, res) => {
  try {

    const foods = await foodService.getFoods(req.query);

    res.json(foods);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

exports.getFoodById = async (req, res) => {

  try {

    const food = await foodService.getFoodById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.createFood = async (req, res) => {

  try {

    // nếu có upload ảnh
    if (req.file) {
      req.body.image_url = req.file.path;
    }

    const food = await foodService.createFood(req.body);

    res.json(food);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.updateFood = async (req, res) => {

  try {

    // nếu upload ảnh mới
    if (req.file) {
      req.body.image_url = req.file.path;
    }

    const food = await foodService.updateFood(req.params.id, req.body);

    res.json(food);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.deleteFood = async (req, res) => {

  try {

    await foodService.deleteFood(req.params.id);

    res.json({ message: "Food deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};