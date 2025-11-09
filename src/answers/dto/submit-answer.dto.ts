import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ example: 'uuid-of-question' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  questionId: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'uuid-of-option' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  optionId: string;
}
