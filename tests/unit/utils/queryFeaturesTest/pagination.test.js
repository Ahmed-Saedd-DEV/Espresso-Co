const {
  getPagination,
} = require("../../../../server/src/utils/queryFeatures/pagination");
const { describe, it, expect } = require("@jest/globals");

describe("getPagination", () => {
  it("should return correct pagination object for valid inputs", () => {
    const result = getPagination(2, 5, 20);
    expect(result).toEqual({
      page: 2,
      limit: 5,
      skip: 5,
      take: 5,
      totalRecords: 20,
      totalPages: 4,
    });
  });
  it("should return correct pagination object when there are no records", () => {
    const result = getPagination(1, 10, 0);
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      take: 10,
      totalRecords: 0,
      totalPages: 0,
    });
  });

  it("should throw an error for invalid page number", () => {
    expect(() => getPagination(-1, 10, 20)).toThrow("Invalid page number");
    expect(() => getPagination(0, 10, 20)).toThrow("Invalid page number");
    expect(() => getPagination("abc", 10, 20)).toThrow("Invalid page number");
  });

  it("should throw an error for invalid limit", () => {
    expect(() => getPagination(1, -5, 20)).toThrow("Invalid limit");
    expect(() => getPagination(1, 0, 20)).toThrow("Invalid limit");
    expect(() => getPagination(1, "abc", 20)).toThrow("Invalid limit");
  });

  it("should convert numeric string inputs for page and limit to numbers", () => {
    const result = getPagination("3", "15", 100);
    expect(result).toEqual({
      page: 3,
      limit: 15,
      skip: 30,
      take: 15,
      totalRecords: 100,
      totalPages: 7,
    });
  });

  it("should throw an error when page or limit is a decimal value", () => {
    expect(() => getPagination(2.5, 10.7, 50)).toThrow("Invalid page number");
    expect(() => getPagination(2, 10.7, 50)).toThrow("Invalid limit");
  });

  it("should use default values when no arguments are provided", () => {
    const result = getPagination();
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      take: 10,
      totalRecords: 0,
      totalPages: 0,
    });
  });

  it("should calculate totalPages correctly when totalRecords is not evenly divisible by limit", () => {
    const result = getPagination(1, 10, 25);
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      take: 10,
      totalRecords: 25,
      totalPages: 3,
    });
  });

  it("should calculate totalPages correctly when totalRecords is a string", () => {
    const result = getPagination(1, 10, "25");
    expect(result).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
      take: 10,
      totalRecords: 25,
      totalPages: 3,
    });  
  });

  it("should throw an error for invalid totalRecords", () => {
    expect(() => getPagination(1, 10, -5)).toThrow("Invalid totalRecords");
    expect(() => getPagination(1, 10, "abc")).toThrow("Invalid totalRecords");
  });

});
