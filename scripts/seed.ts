import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      name: 'Admin User',
      password,
      role: 'ADMIN',
      department: 'Administration'
    },
  });

  const hod = await prisma.user.upsert({
    where: { email: 'hod@college.edu' },
    update: {},
    create: {
      email: 'hod@college.edu',
      name: 'Dr. John Doe',
      password,
      role: 'HOD',
      department: 'Computer Science'
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@college.edu' },
    update: {},
    create: {
      email: 'staff@college.edu',
      name: 'Prof. Smith',
      password,
      role: 'STAFF',
      department: 'Computer Science'
    },
  });

  // Create Budget
  const budget = await prisma.budget.upsert({
    where: { academicYear: '2023-2024' },
    update: {},
    create: {
      academicYear: '2023-2024',
      totalAmount: 5000000,
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-05-31'),
      categories: {
        create: [
            { name: 'Laboratory Equipment', allocated: 2000000 },
            { name: 'Software Licenses', allocated: 1000000 },
            { name: 'Events & Workshops', allocated: 800000 },
            { name: 'Travel & Allowance', allocated: 500000 },
            { name: 'Stationery', allocated: 500000 }
        ]
      }
    }
  });

  console.log({ admin, hod, staff, budget });
}

main()
  .catch((e) => {
    console.error(e);
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });