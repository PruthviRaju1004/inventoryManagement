import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteAllData(): Promise<void> {
  // console.log("Starting to clear user data...");

  try {
    await prisma.user.deleteMany();
    // console.log("User data cleared successfully.");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
}

async function main() {
  await deleteAllData();
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
