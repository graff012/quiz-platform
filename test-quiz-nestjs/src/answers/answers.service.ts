import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class AnswersService {
  constructor(private prisma: PrismaService) {}

  async submitAnswer(submitAnswerDto: SubmitAnswerDto) {
    const { questionId, userId, optionId } = submitAnswerDto;

    // Check if already answered
    const existing = await this.prisma.answer.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already answered this question');
    }

    // Get the option to check if it's correct
    const option = await this.prisma.option.findUnique({
      where: { id: optionId },
      include: {
        question: {
          include: {
            quiz: true,
          },
        },
      },
    });

    if (!option) {
      throw new NotFoundException('Option not found');
    }

    if (option.questionId !== questionId) {
      throw new BadRequestException('Option does not belong to this question');
    }

    // Create answer
    const answer = await this.prisma.answer.create({
      data: {
        questionId,
        userId,
        optionId,
        isCorrect: option.isCorrect,
      },
      include: {
        question: {
          select: {
            id: true,
            text: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
            label: true,
            isCorrect: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Update participant score if correct
    if (option.isCorrect) {
      const quizId = option.question.quiz.id;
      await this.prisma.quizParticipants.updateMany({
        where: {
          quizId,
          userId,
        },
        data: {
          score: {
            increment: 1,
          },
        },
      });
    }

    return answer;
  }

  async findAll(questionId?: string, userId?: string) {
    return this.prisma.answer.findMany({
      where: {
        questionId,
        userId,
      },
      include: {
        question: {
          select: {
            id: true,
            text: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
            label: true,
            isCorrect: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      include: {
        question: {
          select: {
            id: true,
            text: true,
          },
        },
        option: {
          select: {
            id: true,
            text: true,
            label: true,
            isCorrect: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }

    return answer;
  }

  async getQuestionStats(questionId: string) {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      include: {
        option: true,
      },
    });

    const totalAnswers = answers.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;

    const optionStats = await this.prisma.option.findMany({
      where: { questionId },
      include: {
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    return {
      questionId,
      totalAnswers,
      correctAnswers,
      incorrectAnswers: totalAnswers - correctAnswers,
      accuracy: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0,
      optionStats: optionStats.map((opt) => ({
        optionId: opt.id,
        label: opt.label,
        text: opt.text,
        isCorrect: opt.isCorrect,
        selectedCount: opt._count.answers,
        percentage: totalAnswers > 0 ? (opt._count.answers / totalAnswers) * 100 : 0,
      })),
    };
  }
}
