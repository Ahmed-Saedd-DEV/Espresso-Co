const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    const result =
      await prisma.$queryRaw`SELECT to_regclass('public."RefreshToken"') as table_exists`;
    console.log(result);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
