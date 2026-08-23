const prisma = require("../../prisma/prismaClient.js");
const pagination = require("../../utils/queryFeatures/pagination.js");
const sort = require("../../utils/queryFeatures/sort.js");
const search = require("../../utils/queryFeatures/search.js");
const AppError = require("../../utils/errors/AppError");

const validateUserId = (id) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new AppError("Invalid user ID", 400);
  }

  return userId;
};

const getAllUsers = async ({
  page,
  limit,
  searchQuery,
  role,
  isVerified,
  sort: sortField,
  order,
}) => {
  const searchWhiteList = ["name", "email"];
  const sortWhiteList = [
    "id",
    "name",
    "email",
    "role",
    "createdAt",
    "updatedAt",
  ];
  const searchWhere = search.getSearch(searchQuery, searchWhiteList);
  const where = { ...searchWhere };
  const allowedRoles = ["USER", "ADMIN"];

  if (role !== undefined) {
    if (!allowedRoles.includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    where.role = role;
  }

  if (isVerified !== undefined) {
    where.isVerified = isVerified === "true";
  }

  const totalRecords = await prisma.user.count({ where });
  const paginationData = pagination.getPagination(page, limit, totalRecords);
  const normalizedSort = sort.resolveSortQuery({ sort: sortField, order });
  const orderBy = sort.getSorting(
    normalizedSort.sort,
    normalizedSort.order,
    sortWhiteList,
  );

  const users = await prisma.user.findMany({
    where,
    skip: paginationData.skip,
    take: paginationData.take,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    users,
    totalUsers: totalRecords,
    totalPages: paginationData.totalPages,
    currentPage: paginationData.page,
    page: paginationData.page,
    limit: paginationData.limit,
    pagination: {
      page: paginationData.page,
      limit: paginationData.limit,
      totalPages: paginationData.totalPages,
      totalRecords,
    },
  };
};

const getUserById = async (id) => {
  const userId = validateUserId(id);

  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUser = async (id, userData) => {
  const userId = validateUserId(id);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  const allowedFields = ["name", "email", "role", "isVerified"];
  const data = {};

  for (const field of allowedFields) {
    if (userData[field] !== undefined) {
      data[field] = userData[field];
    }
  }

  if (Object.keys(data).length === 0) {
    throw new AppError("No valid fields provided", 400);
  }

  if (data.role !== undefined) {
    const allowedRoles = ["USER", "ADMIN"];

    if (!allowedRoles.includes(data.role)) {
      throw new AppError("Invalid role", 400);
    }
  }

  if (data.isVerified !== undefined) {
    if (typeof data.isVerified !== "boolean") {
      throw new AppError("isVerified must be a boolean", 400);
    }
  }

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const deleteUser = async (id) => {
  const userId = validateUserId(id);

  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  return await prisma.user.delete({
    where: { id: userId },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
