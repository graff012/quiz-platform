import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const { options, ...questionData } = createQuestionDto;

    if (!options || options.length < 2) {
      throw new BadRequestException('Question must have at least 2 options');
    }

    const correctOptions = options.filter((opt) => opt.isCorrect);
    if (correctOptions.length === 0) {
      throw new BadRequestException('At least one option must be marked as correct');
    }

    return this.prisma.question.create({
      data: {
        ...questionData,
        options: {
          create: options.map((opt, index) => ({
            ...opt,
            order: index,
          })),
        },
      },
      include: {
        options: true,
      },
    });
  }

  async findAll(quizId?: string) {
    return this.prisma.question.findMany({
      where: quizId ? { quizId } : undefined,
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    await this.findOne(id);

    const { options, ...questionData } = updateQuestionDto;

    if (options) {
      if (options.length < 2) {
        throw new BadRequestException('Question must have at least 2 options');
      }

      const correctOptions = options.filter((opt) => opt.isCorrect);
      if (correctOptions.length === 0) {
        throw new BadRequestException('At least one option must be marked as correct');
      }

      // Delete existing options and create new ones
      await this.prisma.option.deleteMany({
        where: { questionId: id },
      });

      return this.prisma.question.update({
        where: { id },
        data: {
          ...questionData,
          options: {
            create: options.map((opt, index) => ({
              ...opt,
              order: index,
            })),
          },
        },
        include: {
          options: true,
        },
      });
    }

    return this.prisma.question.update({
      where: { id },
      data: questionData,
      include: {
        options: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.question.delete({
      where: { id },
    });
  }
}
