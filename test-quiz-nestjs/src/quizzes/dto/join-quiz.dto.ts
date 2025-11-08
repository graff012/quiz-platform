import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinQuizDto {
  @ApiProperty({ example: '123456', description: 'Quiz code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'John', description: 'Student name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone number (optional)', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: 'uuid-of-team', description: 'Team ID for team quizzes (optional)', required: false })
  @IsString()
  @IsOptional()
  teamId?: string;
}
