const { describe, it, expect } = require("@jest/globals");

jest.mock("../../../server/src/prisma/prismaClient", () => ({}));

const orderUtils = require("../../../server/src/utils/orderUtils");

describe("orderUtils", () => {
  describe("checkStock", () => {
    it("should return products when all products exist and have enough stock", async () => {
      const orderItems = [{ productId: 1, quantity: 2 }];
      const mockTx = {
        product: {
          findMany: jest.fn().mockResolvedValue([{ id: 1, stock: 5 }]),
        },
      };
      const result = await orderUtils.checkStock(orderItems, mockTx);

      expect(result).toEqual([{ id: 1, stock: 5 }]);
    });

    it("should call findMany with the correct product IDs", async () => {
      const orderItems = [{ productId: 1, quantity: 2 }];
      const mockTx = {
        product: {
          findMany: jest.fn().mockResolvedValue([{ id: 1, stock: 5 }]),
        },
      };
      await orderUtils.checkStock(orderItems, mockTx);
      expect(mockTx.product.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [1],
          },
        },
      });
    });

    it("should throw an error when a product does not exist", async () => {
      const orderItems = [{ productId: 1, quantity: 2 }];
      const mockTx = {
        product: {
          findMany: jest.fn().mockResolvedValue([]),
        },
      };
      await expect(orderUtils.checkStock(orderItems, mockTx)).rejects.toThrow(
        `Product not found: ${orderItems[0].productId}`,
      );
    });

    it("should throw an error if product stock is insufficient", async () => {
      const orderItems = [{ productId: 1, quantity: 6 }];
      const mockTx = {
        product: {
          findMany: jest.fn().mockResolvedValue([{ id: 1, stock: 5 }]),
        },
      };

      await expect(orderUtils.checkStock(orderItems, mockTx)).rejects.toThrow(
        `Insufficient stock for product ${orderItems[0].productId}`,
      );
    });
  });

  describe ("updateDecreaseStock", () => {
    it("should decrease stock successfully", async () => {
      const orderItems = [{ productId: 1, quantity: 1 }];
      const mockTx = {
        product: {
          updateMany: jest.fn().mockResolvedValue([{ id: 1, stock: 5 }]),
        },
      };
      const result = await orderUtils.updateDecreaseStock(orderItems, mockTx);
      expect(result).toEqual(true);
    });
  });
});
