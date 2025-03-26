import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // สร้างบทบาทเริ่มต้น (หากยังไม่มี)
  const superadmin = await prisma.role.upsert({
    where: { name: "superadmin" },
    update: {},
    create: {
      name: "superadmin",
      title: "Super Administrator",
    },
  });

  const admin = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      title: "Administrator",
    },
  });

  const user = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      title: "Regular User",
    },
  });

  console.log({ superadmin, admin, user });
  const hashedPassword = await bcrypt.hash('Superadminpassword1', 10);

  const superAdminUser = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      createDate: new Date(),
      roleId: superadmin.id
    },
  });

  console.log({ superAdminUser });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
