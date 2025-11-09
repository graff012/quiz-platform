import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'uuid-of-quiz' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @ApiProperty({ example: 'Team Alpha' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
