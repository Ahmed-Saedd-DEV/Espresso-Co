const { describe, it, expect } = require("@jest/globals");

const {
  registerSchema,
} = require("../../../server/src/validators/user/auth.validator");
const {
  updateUserSchema,
} = require("../../../server/src/validators/admin/user.validator");

describe("security validation regressions", () => {
  it("rejects role injection in registration payload", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "Test",
        email: "test1@x.com",
        password: "Abcdef1!",
        role: "ADMIN",
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects weak passwords with a clear uppercase/digit requirement", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "Test",
        email: "test2@x.com",
        password: "123",
      },
    });

    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((issue) =>
        /uppercase|digit|lowercase/i.test(issue.message),
      ),
    ).toBe(true);
  });

  it("rejects blank names containing only spaces", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "   ",
        email: "test3@x.com",
        password: "Abcdef1!",
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects unexpected fields in admin user updates", () => {
    const result = updateUserSchema.safeParse({
      params: { id: "1" },
      body: {
        role: "USER",
        isVerified: true,
        extra: "hack",
      },
    });

    expect(result.success).toBe(false);
  });

  it("still allows the normal user registration flow", () => {
    const result = registerSchema.safeParse({
      body: {
        name: "Ahmed Saeed",
        email: "ahmed@x.com",
        password: "Abcdef1!",
      },
    });

    expect(result.success).toBe(true);
  });
});
