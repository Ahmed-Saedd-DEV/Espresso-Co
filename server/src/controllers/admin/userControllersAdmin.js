const userServicesAdmin = require("../../services/admin/userServicesAdmin.js");

const getAllUsers = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      search: searchQuery,
      role,
      isVerified,
      sort,
      order,
    } = req.query;

    const users = await userServicesAdmin.getAllUsers({
      page,
      limit,
      searchQuery,
      role,
      isVerified,
      sort,
      order,
    });

    res.status(200).json({
      data: users.users,
      pagination: users.pagination,
      totalUsers: users.totalUsers,
      totalPages: users.totalPages,
      currentPage: users.currentPage,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userServicesAdmin.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await userServicesAdmin.updateUser(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    await userServicesAdmin.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
