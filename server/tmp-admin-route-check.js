const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("./src/prisma/prismaClient");

(async () => {
  const email = "admin@espresso.local";
  const passwordHash = await bcrypt.hash("Admin123!", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", isVerified: true, password: passwordHash },
    create: { email, name: "Admin User", password: passwordHash, role: "ADMIN", isVerified: true },
  });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, "dev-secret", { expiresIn: "1h" });
  const res = await fetch("http://localhost:5000/admin/orders?page=1&limit=2", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    credentials: "include",
  });

  const text = await res.text();
  console.log("STATUS", res.status);
  console.log(text.slice(0, 1000));
  await prisma.$disconnect();
})().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
