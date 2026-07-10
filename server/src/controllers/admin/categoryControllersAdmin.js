const categoryService = require('../../services/admin/categoryServicesAdmin');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports = {
    createCategory: exports.createCategory,
    updateCategory: exports.updateCategory,
    deleteCategory: exports.deleteCategory
};
