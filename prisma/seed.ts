import { PrismaClient, Role, QuizType, QuizStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create teacher user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const teacher = await prisma.user.upsert({
    where: { phoneNumber: '+998901234567' },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Teacher',
      phoneNumber: '+998901234567',
      password: hashedPassword,
      role: Role.TEACHER,
      telegramId: '123456789', // Optional: add your Telegram ID here
    },
  });

  console.log('✅ Teacher created:', teacher.phoneNumber);

  // Create student users
  const students: any[] = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { phoneNumber: `+99890000000${i}` },
      update: {},
      create: {
        firstName: `Student`,
        lastName: `${i}`,
        phoneNumber: `+99890000000${i}`,
        password: hashedPassword,
        role: Role.STUDENT,
      },
    });
    students.push(student);
  }

  console.log(`✅ ${students.length} students created`);

  // Create a quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'JavaScript Basics Quiz',
      code: '123456',
      type: QuizType.INDIVIDUAL,
      status: QuizStatus.DRAFT,
      teacherId: teacher.id,
      defaultQuestionTime: 15,
    },
  });

  console.log('✅ Quiz created:', quiz.title);

  // Create questions with options
  const questions = [
    {
      text: 'What is the correct way to declare a variable in JavaScript?',
      options: [
        { label: 'A', text: 'var x = 5;', isCorrect: true },
        { label: 'B', text: 'variable x = 5;', isCorrect: false },
        { label: 'C', text: 'v x = 5;', isCorrect: false },
        { label: 'D', text: 'declare x = 5;', isCorrect: false },
      ],
    },
    {
      text: 'Which method is used to add an element to the end of an array?',
      options: [
        { label: 'A', text: 'array.add()', isCorrect: false },
        { label: 'B', text: 'array.append()', isCorrect: false },
        { label: 'C', text: 'array.push()', isCorrect: true },
        { label: 'D', text: 'array.insert()', isCorrect: false },
      ],
    },
    {
      text: 'What does "===" operator do in JavaScript?',
      options: [
        { label: 'A', text: 'Compares values only', isCorrect: false },
        { label: 'B', text: 'Compares values and types', isCorrect: true },
        { label: 'C', text: 'Assigns a value', isCorrect: false },
        { label: 'D', text: 'Checks if variable exists', isCorrect: false },
      ],
    },
    {
      text: 'Which keyword is used to create a function in JavaScript?',
      options: [
        { label: 'A', text: 'func', isCorrect: false },
        { label: 'B', text: 'function', isCorrect: true },
        { label: 'C', text: 'def', isCorrect: false },
        { label: 'D', text: 'method', isCorrect: false },
      ],
    },
    {
      text: 'What is the output of: typeof null?',
      options: [
        { label: 'A', text: 'null', isCorrect: false },
        { label: 'B', text: 'undefined', isCorrect: false },
        { label: 'C', text: 'object', isCorrect: true },
        { label: 'D', text: 'number', isCorrect: false },
      ],
    },
  ];

  for (let i = 0; i < questions.length; i++) {
    const questionData = questions[i];
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        text: questionData.text,
        order: i + 1,
        timeLimit: 15,
        options: {
          create: questionData.options.map((opt, idx) => ({
            ...opt,
            order: idx,
          })),
        },
      },
    });
  }

  console.log(`✅ ${questions.length} questions created with options`);

  // Create a team quiz
  const teamQuiz = await prisma.quiz.create({
    data: {
      title: 'Team Challenge: Web Development',
      code: '654321',
      type: QuizType.TEAM,
      status: QuizStatus.DRAFT,
      teacherId: teacher.id,
      defaultQuestionTime: 20,
    },
  });

  console.log('✅ Team quiz created:', teamQuiz.title);

  // Create teams
  const team1 = await prisma.team.create({
    data: {
      quizId: teamQuiz.id,
      name: 'Team Alpha',
      score: 0,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      quizId: teamQuiz.id,
      name: 'Team Beta',
      score: 0,
    },
  });

  console.log('✅ Teams created');

  // Add team members
  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: students[0].id,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: students[1].id,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: students[2].id,
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: students[3].id,
    },
  });

  console.log('✅ Team members added');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Teacher:');
  console.log('  Phone: +998901234567');
  console.log('  Password: password123');
  console.log('\nStudents:');
  console.log('  Phone: +998900000001 to +998900000005');
  console.log('  Password: password123');
  console.log('\nQuiz Codes:');
  console.log('  Individual Quiz: 123456');
  console.log('  Team Quiz: 654321');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
