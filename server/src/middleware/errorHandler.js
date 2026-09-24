const { PrismaClientKnownRequestError } = require("@prisma/client");

const handlePrismaError = (error) => {
  switch (error.code) {
    case "P2002":
      return {
        statusCode: 409,
        message: "Resource already exists",
      };

    case "P2003":
      return {
        statusCode: 400,
        message: "Invalid related resource",
      };

    case "P2025":
      return {
        statusCode: 404,
        message: "Resource not found",
      };

    default:
      return null;
  }
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(err);

    if (prismaError) {
      return res.status(prismaError.statusCode).json({
        error: prismaError.message,
      });
    }
  }

  const statusCode = err.isOperational
    ? err.statusCode
    : 500;

  const message = err.isOperational
    ? err.message
    : "Internal server error";

  return res.status(statusCode).json({
    error: message,
  });
};

module.exports = errorHandler;
