const {
  getFiltered,
} = require("../../../../server/src/utils/queryFeatures/filter");
const { describe, it, expect } = require("@jest/globals");

describe("getFiltered", () => {
  it("should return the correct filter object when use default values", () => {
    const result = getFiltered();
    expect(result).toEqual({});
  });

  it("should return the correct filter object", () => {
    const result = getFiltered(
      { color: "red" },
      { available: true },
      { price: { min: 50, max: 200 } },
    );
    expect(result).toEqual({
      color: "red",
      available: true,
      price: { gte: 50, lte: 200 },
    });
  });

  it("should handle undefined filters and ranges", () => {
    const result = getFiltered(undefined, undefined, undefined);
    expect(result).toEqual({});
  });

  it("should handle empty filters and ranges", () => {
    const result = getFiltered({}, {}, {});
    expect(result).toEqual({});
  });

  it("should handle only filters", () => {
    const result = getFiltered({ color: "blue", size: "M" }, {}, {});
    expect(result).toEqual({
      color: "blue",
      size: "M",
    });
  });

  it("should handle only ranges", () => {
    const result = getFiltered({}, {}, { price: { min: 10, max: 100 } });
    expect(result).toEqual({
      price: { gte: 10, lte: 100 },
    });
  });

  it("should handle only baseWhere", () => {
    const result = getFiltered({}, { available: true }, {});
    expect(result).toEqual({
      available: true,
    });
  });

  it("should ignore undefined filter values", () => {
    const result = getFiltered(
      { color: undefined, size: "L" },
      { available: true },
      { price: { min: 50, max: 200 } },
    );
    expect(result).toEqual({
      size: "L",
      available: true,
      price: { gte: 50, lte: 200 },
    });
  });

  it("should return the correct filter object when only min is provided in ranges", () => {
    const resultMinOnly = getFiltered({}, {}, { price: { min: 20 } });
    expect(resultMinOnly).toEqual({
      price: { gte: 20 },
    });
  });

  it("should return the correct filter object when only max is provided in ranges", () => {
    const resultMaxOnly = getFiltered({}, {}, { price: { max: 150 } });
    expect(resultMaxOnly).toEqual({
      price: { lte: 150 },
    });
  });

  it("should convert range values from string to number", () => {
    const result = getFiltered({}, {}, { price: { min: "20", max: "200" } });

    expect(result).toEqual({
      price: { gte: 20, lte: 200 },
    });
  });

  it("should return the correct filter object when the filter and range values have the same field name", () => {
    const result = getFiltered(
      { price: 100 },
      { available: true },
      { price: { min: 50, max: 200 } },
    );
    expect(result).toEqual({
      price: 100,
      available: true,
    });
  });
});
