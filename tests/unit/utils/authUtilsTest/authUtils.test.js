const {
  buildAccessTokenPayload,
  parseCookies,
} = require("../../../../server/src/utils/authUtils");

describe("buildAccessTokenPayload", () => {
  it("builds correct payload from user object", () => {
    const user = { id: 1, email: "a@b.com", role: "admin", extra: "x" };
    expect(buildAccessTokenPayload(user)).toEqual({
      id: 1,
      email: "a@b.com",
      role: "admin",
    });
  });
});

describe("parseCookies", () => {
  it("returns empty object when no cookie header", () => {
    expect(parseCookies({})).toEqual({});
    expect(parseCookies({ headers: {} })).toEqual({});
  });

  it("parses simple key=value pairs", () => {
    const req = { headers: { cookie: "a=1; b=two" } };
    expect(parseCookies(req)).toEqual({ a: "1", b: "two" });
  });

  it("handles flag-style cookies (no value)", () => {
    const req = { headers: { cookie: "secureFlag; other=3" } };
    expect(parseCookies(req)).toEqual({ secureFlag: "", other: "3" });
  });

  it("preserves equals in values and trims whitespace", () => {
    const req = { headers: { cookie: "token=part1=part2;  x=  y " } };
    const parsed = parseCookies(req);
    expect(parsed.token).toBe("part1=part2");
    expect(parsed.x).toBe("y");
  });

  it("removes wrapping quotes and decodes URI components when possible", () => {
    const encoded = encodeURIComponent("hello world");
    const req = { headers: { cookie: `q="quoted"; e=${encoded}` } };
    const parsed = parseCookies(req);
    expect(parsed.q).toBe("quoted");
    expect(parsed.e).toBe("hello world");
  });

  it("keeps raw value when decodeURIComponent throws", () => {
    // '%' is invalid for decodeURIComponent and will throw
    const req = { headers: { cookie: "bad=%; ok=1" } };
    const parsed = parseCookies(req);
    expect(parsed.bad).toBe("%");
    expect(parsed.ok).toBe("1");
  });
});
