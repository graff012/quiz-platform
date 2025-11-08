import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JoinQuizDto } from './dto/join-quiz.dto';
import { QuizStatus } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, createQuizDto: CreateQuizDto) {
    // Generate unique 6-digit code
    const code = this.generateQuizCode();

    return this.prisma.quiz.create({
      data: {
        ...createQuizDto,
        code,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(teacherId?: string) {
    return this.prisma.quiz.findMany({
      where: teacherId ? { teacherId } : undefined,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        _count: {
          select: {
            questions: true,
            participants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            telegramId: true,
          },
        },
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        teams: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async findByCode(code: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { code },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with code ${code} not found`);
    }

    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    await this.findOne(id);

    return this.prisma.quiz.update({
      where: { id },
      data: updateQuizDto,
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            questions: true,
            participants: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.quiz.delete({
      where: { id },
    });
  }

  async startQuiz(id: string) {
    const quiz = await this.findOne(id);

    if (quiz.status === QuizStatus.ACTIVE) {
      throw new BadRequestException('Quiz is already active');
    }

    if (quiz.status === QuizStatus.COMPLETED) {
      throw new BadRequestException('Quiz is already completed');
    }

    if (quiz.questions.length === 0) {
      throw new BadRequestException('Cannot start quiz without questions');
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        status: QuizStatus.ACTIVE,
        startedAt: new Date(),
      },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: { order: 'asc' },
        },
        participants: true,
      },
    });
  }

  async completeQuiz(id: string) {
    const quiz = await this.findOne(id);

    if (quiz.status !== QuizStatus.ACTIVE) {
      throw new BadRequestException('Only active quizzes can be completed');
    }

    return this.prisma.quiz.update({
      where: { id },
      data: {
        status: QuizStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async joinQuiz(joinQuizDto: JoinQuizDto) {
    const quiz = await this.findByCode(joinQuizDto.code);

    if (quiz.status === QuizStatus.COMPLETED) {
      throw new BadRequestException('Quiz is already completed');
    }

    // Create or find guest user (student without registration)
    let user = await this.prisma.user.findUnique({
      where: { phoneNumber: joinQuizDto.phoneNumber || `guest_${Date.now()}` },
    });

    if (!user) {
      // Create a guest user for this quiz session
      user = await this.prisma.user.create({
        data: {
          firstName: joinQuizDto.name,
          lastName: null,
          phoneNumber: joinQuizDto.phoneNumber || `guest_${Date.now()}`,
          password: null, // Guest users don't have passwords
          role: 'STUDENT',
        },
      });
    }

    // Check if user already joined this quiz
    const existing = await this.prisma.quizParticipants.findUnique({
      where: {
        quizId_userId: {
          quizId: quiz.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      return { 
        message: 'Already joined', 
        participant: existing,
        userId: user.id,
      };
    }

    const participant = await this.prisma.quizParticipants.create({
      data: {
        quizId: quiz.id,
        userId: user.id,
        teamId: joinQuizDto.teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        quiz: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
          },
        },
      },
    });

    return { 
      message: 'Successfully joined', 
      participant,
      userId: user.id, // Return userId for WebSocket connection
    };
  }

  async getLeaderboard(quizId: string) {
    const quiz = await this.findOne(quizId);

    const participants = await this.prisma.quizParticipants.findMany({
      where: { quizId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { score: 'desc' },
    });

    return {
      quizId,
      quizTitle: quiz.title,
      participants,
    };
  }

  private generateQuizCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
