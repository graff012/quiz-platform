import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { QuizType } from '@prisma/client';

export class CreateQuizDto {
  @ApiProperty({ example: 'JavaScript Basics Quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: QuizType, example: QuizType.INDIVIDUAL, default: QuizType.INDIVIDUAL })
  @IsEnum(QuizType)
  @IsOptional()
  type?: QuizType;

  @ApiProperty({ example: 15, required: false, description: 'Default time limit for questions in seconds' })
  @IsInt()
  @Min(5)
  @IsOptional()
  defaultQuestionTime?: number;
}
