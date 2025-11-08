import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateOptionDto {
  @ApiProperty({ example: 'Paris' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({ example: 'uuid-of-quiz' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @ApiProperty({ example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({ example: 15, default: 10 })
  @IsInt()
  @Min(5)
  timeLimit: number;

  @ApiProperty({
    type: [CreateOptionDto],
    example: [
      { text: 'Paris', label: 'A', isCorrect: true },
      { text: 'London', label: 'B', isCorrect: false },
      { text: 'Berlin', label: 'C', isCorrect: false },
      { text: 'Madrid', label: 'D', isCorrect: false },
    ],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
