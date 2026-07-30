const prisma = require("../../prisma/prismaClient.js");
const pagination = require("../../utils/queryFeatures/pagination.js");
const sort = require("../../utils/queryFeatures/sort.js");
const search = require("../../utils/queryFeatures/search.js");

const validateUserId = (id) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID");
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
      throw new Error("Invalid role");
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
    throw new Error("User not found");
  }

  const allowedFields = ["name", "email", "role", "isVerified"];
  const data = {};

  for (const field of allowedFields) {
    if (userData[field] !== undefined) {
      data[field] = userData[field];
    }
  }

  if (Object.keys(data).length === 0) {
    throw new Error("No valid fields provided");
  }

  if (data.role !== undefined) {
    const allowedRoles = ["USER", "ADMIN"];

    if (!allowedRoles.includes(data.role)) {
      throw new Error("Invalid role");
    }
  }

  if (data.isVerified !== undefined) {
    if (typeof data.isVerified !== "boolean") {
      throw new Error("isVerified must be a boolean");
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
    throw new Error("User not found");
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
