const categoryService = require('../../services/admin/categoryServicesAdmin');

exports.createCategory = async (req, res, next) => {
    try {
        const newCategory = await categoryService.createCategory(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

