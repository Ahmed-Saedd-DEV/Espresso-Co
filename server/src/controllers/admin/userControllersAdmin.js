const userServicesAdmin = require("../../services/admin/userServicesAdmin.js");

const getAllUsers = async (req, res) => {
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
      sortBy: sort,
      order,
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userServicesAdmin.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    if (error.message === "Invalid user ID") {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  try {
    const updatedUser = await userServicesAdmin.updateUser(id, userData);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      [
        "Invalid user ID",
        "No valid fields provided",
        "Invalid role",
        "isVerified must be a boolean",
      ].includes(error.message)
    ) {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userServicesAdmin.deleteUser(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }

    if (error.message === "Invalid user ID") {
      return res.status(400).json({ message: error.message });
    }

    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
