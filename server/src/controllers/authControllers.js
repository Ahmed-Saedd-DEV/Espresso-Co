const authServices = require('../services/authServices');
const tokenUtils = require('../utils/jwt');


exports.registerUser = async (req, res) => {
    try {
        const user = await authServices.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const result = await authServices.loginUser(req.body);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await authServices.getProfile(req.user.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.logoutUser = (req, res) => {
    // Clear the token
    res.json({ message: 'Logout successful' });
};



module.exports = {
    registerUser: exports.registerUser,
    loginUser: exports.loginUser,
    getProfile: exports.getProfile,
    logoutUser: exports.logoutUser
};