const {
  getSearch,
} = require("../../../../server/src/utils/queryFeatures/search");

describe("getSearch", () => {
  it("returns empty object when search is falsy", () => {
    expect(getSearch("", ["name"])).toEqual({});
    expect(getSearch(null, ["name"])).toEqual({});
    expect(getSearch(undefined, ["name"])).toEqual({});
  });

  it("throws when whitelist has no string fields", () => {
    expect(() => getSearch("term", [])).toThrow(
      "No searchable fields provided",
    );
    expect(() => getSearch("term", [1, {}, null])).toThrow(
      "No searchable fields provided",
    );
  });

  it("builds OR search for provided fields", () => {
    const result = getSearch("coffee", ["title", "description"]);

    expect(result).toHaveProperty("OR");
    expect(Array.isArray(result.OR)).toBe(true);
    expect(result.OR).toEqual([
      { title: { contains: "coffee", mode: "insensitive" } },
      { description: { contains: "coffee", mode: "insensitive" } },
    ]);
  });

  it("ignores non-string entries in whitelist", () => {
    const result = getSearch("x", ["name", 123, null, "tag"]);

    expect(result.OR.length).toBe(2);
    expect(result.OR[0]).toHaveProperty("name");
    expect(result.OR[1]).toHaveProperty("tag");
  });
});
