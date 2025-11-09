import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ example: 'uuid-of-team' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  teamId: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
