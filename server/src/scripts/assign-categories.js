// One-off script: assigns existing products with categoryId: null to
// real categories (Coffee, Sweets) via round-robin distribution.
//
// Usage (from server/ root, where node_modules lives):
//   node src/scripts/assign-categories.js
//
// Safe to re-run: only touches products where categoryId is currently null.

const prisma = require("../prisma/prismaClient");

const CATEGORY_NAMES = ["Coffee", "Sweets"];

async function ensureCategories() {
  const categories = [];

  for (const name of CATEGORY_NAMES) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  return categories;
}

async function main() {
  console.log("Ensuring categories exist:", CATEGORY_NAMES.join(", "));
  const categories = await ensureCategories();
  categories.forEach((c) => console.log(`  - ${c.name} (id: ${c.id})`));

  const uncategorized = await prisma.product.findMany({
    where: { categoryId: null },
    select: { id: true, name: true },
    orderBy: { id: "asc" },
  });

  if (uncategorized.length === 0) {
    console.log("No products with categoryId: null found. Nothing to do.");
    return;
  }

  console.log(
    `\nFound ${uncategorized.length} uncategorized product(s). Assigning round-robin...\n`,
  );

  let index = 0;
  for (const product of uncategorized) {
    const category = categories[index % categories.length];

    await prisma.product.update({
      where: { id: product.id },
      data: { categoryId: category.id },
    });

    console.log(
      `  Product #${product.id} "${product.name}" -> ${category.name}`,
    );
    index += 1;
  }

  console.log(
    `\nDone. Assigned ${uncategorized.length} product(s) across ${categories.length} categories.`,
  );
}

main()
  .catch((err) => {
    console.error("Script failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
