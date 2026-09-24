require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  try {
    const email = "admin@espresso.local";
    const passwordHash = await bcrypt.hash("Admin123!", 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", isVerified: true, password: passwordHash },
      create: {
        email,
        name: "Admin User",
        password: passwordHash,
        role: "ADMIN",
        isVerified: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const res = await fetch("http://localhost:5000/admin/products?page=1&limit=2", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const text = await res.text();
    console.log("STATUS", res.status);
    console.log(text.slice(0, 700));
    await prisma.$disconnect();
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exit(1);
  }
})();
