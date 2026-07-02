import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: { name: 'SUPER_ADMIN' }
  });

  const electionAdminRole = await prisma.role.upsert({
    where: { name: 'ELECTION_ADMIN' },
    update: {},
    create: { name: 'ELECTION_ADMIN' }
  });

  const voterRole = await prisma.role.upsert({
    where: { name: 'VOTER' },
    update: {},
    create: { name: 'VOTER' }
  });

  console.log('✅ Roles created');

  // Create super admin user
  const hashedPassword = await bcrypt.hash('Admin@12345', 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@votingsystem.com' },
    update: {},
    create: {
      email: 'admin@votingsystem.com',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      roleId: superAdminRole.id,
      emailVerified: true
    }
  });

  console.log('✅ Super admin user created');

  // Create election admin
  const electionAdmin = await prisma.user.upsert({
    where: { email: 'election.admin@votingsystem.com' },
    update: {},
    create: {
      email: 'election.admin@votingsystem.com',
      firstName: 'Election',
      lastName: 'Admin',
      password: hashedPassword,
      roleId: electionAdminRole.id,
      emailVerified: true
    }
  });

  // Create ElectionAdmin profile
  await prisma.electionAdmin.upsert({
    where: { userId: electionAdmin.id },
    update: {},
    create: { userId: electionAdmin.id }
  });

  console.log('✅ Election admin user created');

  // Create sample voters
  const voters = [];
  for (let i = 1; i <= 5; i++) {
    const voter = await prisma.user.upsert({
      where: { email: `voter${i}@votingsystem.com` },
      update: {},
      create: {
        email: `voter${i}@votingsystem.com`,
        firstName: `Voter`,
        lastName: `${i}`,
        password: hashedPassword,
        roleId: voterRole.id,
        emailVerified: true
      }
    });
    voters.push(voter);
  }

  console.log('✅ Sample voters created');

  // Create sample election
  const now = new Date();
  const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later

  const election = await prisma.election.create({
    data: {
      title: 'Annual Club President Election 2024',
      description: 'Vote for the next president of our organization',
      startDate,
      endDate,
      status: 'DRAFT',
      isPublic: true,
      admin: {
        connect: { id: (await prisma.electionAdmin.findUnique({ where: { userId: electionAdmin.id } }))?.id || '' }
      }
    }
  });

  console.log('✅ Sample election created');

  // Create positions
  const presidentPosition = await prisma.position.create({
    data: {
      title: 'President',
      description: 'Lead the organization',
      order: 1,
      maxVotes: 1,
      electionId: election.id
    }
  });

  const secretaryPosition = await prisma.position.create({
    data: {
      title: 'Secretary',
      description: 'Handle organizational records',
      order: 2,
      maxVotes: 1,
      electionId: election.id
    }
  });

  console.log('✅ Positions created');

  // Create candidates
  const candidates = [
    { name: 'Alice Johnson', position: presidentPosition.id, order: 1 },
    { name: 'Bob Smith', position: presidentPosition.id, order: 2 },
    { name: 'Carol White', position: presidentPosition.id, order: 3 },
    { name: 'David Brown', position: secretaryPosition.id, order: 1 },
    { name: 'Eve Davis', position: secretaryPosition.id, order: 2 }
  ];

  for (const candidate of candidates) {
    await prisma.candidate.create({
      data: {
        name: candidate.name,
        bio: `Bio for ${candidate.name}`,
        positionId: candidate.position,
        order: candidate.order
      }
    });
  }

  console.log('✅ Candidates created');

  // Add voters to election
  for (const voter of voters) {
    await prisma.voter.create({
      data: {
        userId: voter.id,
        electionId: election.id
      }
    });
  }

  console.log('✅ Voters added to election');

  console.log('✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
