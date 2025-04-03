import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Tags
  const tag1 = await prisma.tag.upsert({
    where: { name: 'Technology' },
    update: {},
    create: { name: 'Technology' },
  });
  console.log(`Created tag with id: ${tag1.id}`);

  const tag2 = await prisma.tag.upsert({
    where: { name: 'Tutorial' },
    update: {},
    create: { name: 'Tutorial' },
  });
  console.log(`Created tag with id: ${tag2.id}`);

  // Create Posts
  const post1 = await prisma.post.upsert({
    where: { slug: 'first-post' },
    update: {},
    create: {
      title: 'My First Blog Post',
      slug: 'first-post',
      content: `
# Welcome to my blog!

This is the first post, written in **Markdown**.

Here's a list:
- Item 1
- Item 2

\`\`\`javascript
console.log('Hello, world!');
\`\`\`
      `,
      published: true,
      tags: {
        connect: [{ id: tag1.id }, { id: tag2.id }], // Connect by id
      },
    },
  });
  console.log(`Created post with id: ${post1.id}`);

  const post2 = await prisma.post.upsert({
    where: { slug: 'second-post-draft' },
    update: {},
    create: {
      title: 'A Second Post (Draft)',
      slug: 'second-post-draft',
      content: `This post is currently a draft and should not be visible on the main blog page.`,
      published: false, // Draft post
      tags: {
        connect: [{ id: tag1.id }], // Connect by id
      },
    },
  });
  console.log(`Created post with id: ${post2.id}`);

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