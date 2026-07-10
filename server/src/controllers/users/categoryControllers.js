const categoryService = require('../../services/user/categoryServices');

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.json(category);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};


module.exports = {
    getCategories: exports.getCategories,
    getCategoryById: exports.getCategoryById,
};
