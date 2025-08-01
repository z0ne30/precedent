import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create a sample contact submission for testing
  const contactSubmission = await prisma.contactSubmission.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test contact submission.',
    },
  });
  console.log(`Created contact submission with id: ${contactSubmission.id}`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
