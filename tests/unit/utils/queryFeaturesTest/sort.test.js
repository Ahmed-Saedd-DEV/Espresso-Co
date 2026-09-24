const { describe, it, expect } = require("@jest/globals");
const {
  resolveSortQuery,
  getSorting,
} = require("../../../../server/src/utils/queryFeatures/sort");

describe("resolveSortQuery", () => {
  it("should return default values when no parameters are provided", () => {
    const result = resolveSortQuery();
    expect(result).toEqual({ sort: "createdAt", order: "asc" });
  });

  it("should return provided sort and order values", () => {
    const result = resolveSortQuery({ sort: "name", order: "desc" });
    expect(result).toEqual({ sort: "name", order: "desc" });
  });

  it("should prioritize sort over sortBy", () => {
    const result = resolveSortQuery({
      sort: "name",
      sortBy: "price",
      order: "desc",
    });
    expect(result).toEqual({ sort: "name", order: "desc" });
  });

  it("should return default order when only sort is provided", () => {
    const result = resolveSortQuery({ sort: "order" });
    expect(result).toEqual({ sort: "order", order: "asc" });
  });

  it("should return default sort when only order is provided", () => {
    const result = resolveSortQuery({ order: "desc" });
    expect(result).toEqual({ sort: "createdAt", order: "desc" });
  });

  it("should return error when input number inside 'sort' is provided", () => {
    expect(() => resolveSortQuery({ sort: 123, order: "desc" })).toThrow(
      "Invalid sort field",
    );
  });

  it("should return error when input number inside 'order' is provided", () => {
    expect(() => resolveSortQuery({ sort: "name", order: 123 })).toThrow(
      "Invalid order value",
    );
  });
});

describe("getSorting", () => {
  it("should return correct sort object for valid inputs", () => {
    const result = getSorting("name", "desc", ["name", "createdAt"]);
    expect(result).toEqual({ name: "desc" });
  });

  it("should return correct sort object when asc order is provided", () => {
    const result = getSorting("name", "asc", ["name", "createdAt"]);
    expect(result).toEqual({ name: "asc" });
  });

  it("should return default sort object when no sort and order are provided", () => {
    const result = getSorting(undefined, undefined, ["name", "createdAt"]);
    expect(result).toEqual({ createdAt: "asc" });
  });

  it("should throw an error for invalid sort field", () => {
    expect(() =>
      getSorting("invalidField", "asc", ["name", "createdAt"]),
    ).toThrow("Invalid sort field");
  });

  it("should throw an error for invalid sort field", () => {
    expect(() =>
      getSorting("invalidField", "asc", ["name", "createdAt"]),
    ).toThrow("Invalid sort field");
  });

  it("should throw an error for invalid order value", () => {
    expect(() =>
      getSorting("name", "invalidOrder", ["name", "createdAt"]),
    ).toThrow("Invalid order value");
  });

  it("should default to 'createdAt' and 'asc' when no sort and order are provided", () => {
    const result = getSorting(undefined, undefined, ["name", "createdAt"]);
    expect(result).toEqual({ createdAt: "asc" });
  });

  it("should error whene input number is provided for order", () => {
    expect(() => getSorting("name", 123, ["name", "createdAt"])).toThrow(
      "Invalid order value",
    );
  });

  it("should error whene input number is provided for sort", () => {
    expect(() => getSorting(123, "asc", ["name", "createdAt"])).toThrow(
      "Invalid sort field",
    );
  });

  it("should error whene be the output of the order is not asc or desc", () => {
    expect(() =>
      getSorting("name", "ascending", ["name", "createdAt"]),
    ).toThrow("Invalid order value");
  });
});
