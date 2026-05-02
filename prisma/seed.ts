// prisma/seed.ts – Seeds demo data for development
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const pw = await bcrypt.hash('password123', 12);

  // ── Admin ─────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where:  { email: 'admin@demo.com' },
    update: {},
    create: {
      email:         'admin@demo.com',
      password:      pw,
      role:          'ADMIN',
      status:        'APPROVED',
      emailVerified: new Date(),
      profile: {
        create: {
          firstName:   'Admin',
          lastName:    'User',
          batchYear:   2015,
          department:  'Computer Engineering',
          currentRole: 'Portal Administrator',
          skills:      ['Administration', 'Management'],
          profileComplete: true,
        },
      },
    },
  });
  console.log('✅ Admin created:', admin.email);

  // ── Alumni ────────────────────────────────────────────────────────────────
  const alumniData = [
    {
      email: 'alumni@demo.com', firstName: 'Arjun', lastName: 'Mehta',
      batch: 2019, dept: 'Computer Engineering', role: 'Senior Engineer', company: 'Google',
      city: 'Bangalore', skills: ['Go', 'Kubernetes', 'System Design', 'Python'],
      bio: 'Building distributed systems at scale. 5 years at Google.',
      openToMentor: true,
    },
    {
      email: 'priya@demo.com', firstName: 'Priya', lastName: 'Sharma',
      batch: 2017, dept: 'Information Technology', role: 'Founder', company: 'EduStart',
      city: 'Mumbai', skills: ['Startups', 'Product', 'Fundraising'],
      bio: 'Built a $5M ARR EdTech startup. Serial entrepreneur.',
      openToMentor: true,
    },
    {
      email: 'rohan@demo.com', firstName: 'Rohan', lastName: 'Patel',
      batch: 2020, dept: 'Computer Engineering', role: 'Product Manager', company: 'Microsoft',
      city: 'Hyderabad', skills: ['Product Strategy', 'SQL', 'User Research'],
      bio: 'PM at Microsoft Azure. Helping engineers transition to PM.',
      openToMentor: true,
    },
  ];

  for (const data of alumniData) {
    const u = await prisma.user.upsert({
      where:  { email: data.email },
      update: {},
      create: {
        email:         data.email,
        password:      pw,
        role:          'ALUMNI',
        status:        'APPROVED',
        emailVerified: new Date(),
        profile: {
          create: {
            firstName:      data.firstName,
            lastName:       data.lastName,
            batchYear:      data.batch,
            department:     data.dept,
            currentRole:    data.role,
            currentCompany: data.company,
            city:           data.city,
            country:        'India',
            skills:         data.skills,
            bio:            data.bio,
            openToMentor:   data.openToMentor,
            profileComplete: true,
          },
        },
        leaderboardEntry: { create: { mentorScore: Math.floor(Math.random() * 100), totalScore: Math.floor(Math.random() * 300) } },
      },
    });
    console.log('✅ Alumni created:', u.email);
  }

  // ── Student ───────────────────────────────────────────────────────────────
  const student = await prisma.user.upsert({
    where:  { email: 'student@demo.com' },
    update: {},
    create: {
      email:         'student@demo.com',
      password:      pw,
      role:          'STUDENT',
      status:        'APPROVED',
      emailVerified: new Date(),
      profile: {
        create: {
          firstName:  'Rahul',
          lastName:   'Sharma',
          batchYear:  2024,
          department: 'Computer Engineering',
          city:       'Rajkot',
          country:    'India',
          skills:     ['React', 'Python', 'SQL'],
          bio:        'Final year CE student. Passionate about web dev.',
          profileComplete: true,
        },
      },
      leaderboardEntry: { create: {} },
    },
  });
  console.log('✅ Student created:', student.email);

  // ── Jobs ─────────────────────────────────────────────────────────────────
  const alumniUser = await prisma.user.findFirst({ where: { email: 'alumni@demo.com' } });
  if (alumniUser) {
    await prisma.job.createMany({
      data: [
        {
          posterId:    alumniUser.id,
          title:       'Software Engineer II',
          company:     'Google',
          description: 'Join our infrastructure team building planet-scale distributed systems.',
          requirements: ['B.E./B.Tech in CS', '2+ years experience', 'Strong DSA'],
          skills:      ['Go', 'Python', 'Kubernetes', 'System Design'],
          location:    'Bangalore, India',
          type:        'FULL_TIME',
          salary:      '₹30–45 LPA',
          applyUrl:    'https://careers.google.com',
          isApproved:  true,
          isActive:    true,
        },
        {
          posterId:    alumniUser.id,
          title:       'SWE Intern – Summer 2025',
          company:     'Google',
          description: 'Summer internship program. Work on real products with real impact.',
          requirements: ['Pursuing B.E./B.Tech', 'Strong DSA', 'Any programming language'],
          skills:      ['Python', 'Java', 'C++', 'DSA'],
          location:    'Hyderabad, India',
          type:        'INTERNSHIP',
          salary:      '₹1.5L/month',
          applyUrl:    'https://careers.google.com/students',
          isApproved:  true,
          isActive:    true,
        },
      ],
    });
    console.log('✅ Jobs created');
  }

  // ── Events ────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        title:       'Tech Summit 2024 – Future of AI',
        description: 'Full-day conference on the future of AI featuring keynotes and workshops.',
        startDate:   new Date('2024-12-22T09:00:00'),
        endDate:     new Date('2024-12-22T18:00:00'),
        location:    'GEC Rajkot Auditorium',
        isVirtual:   false,
        status:      'UPCOMING',
        capacity:    250,
        tags:        ['AI', 'Technology', 'Networking'],
      },
      {
        title:       'Alumni Virtual Meetup – December',
        description: 'Monthly virtual meetup for all alumni worldwide.',
        startDate:   new Date('2024-12-28T18:00:00'),
        endDate:     new Date('2024-12-28T20:00:00'),
        location:    'Google Meet',
        isVirtual:   true,
        meetLink:    'https://meet.google.com/demo',
        status:      'UPCOMING',
        capacity:    100,
        tags:        ['Networking', 'Virtual'],
      },
    ],
  });
  console.log('✅ Events created');

  console.log('\n🎉 Seed complete!\n');
  console.log('Demo login credentials:');
  console.log('  Admin:   admin@demo.com / password123');
  console.log('  Alumni:  alumni@demo.com / password123');
  console.log('  Student: student@demo.com / password123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
