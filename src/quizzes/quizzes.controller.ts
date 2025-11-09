import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JoinQuizDto } from './dto/join-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new quiz (Teacher only)' })
  @ApiResponse({ status: 201, description: 'Quiz successfully created' })
  create(@CurrentUser() user: any, @Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(user.userId, createQuizDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiResponse({ status: 200, description: 'Return all quizzes' })
  findAll(@Query('teacherId') teacherId?: string) {
    return this.quizzesService.findAll(teacherId);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get quiz by code (for students joining)' })
  @ApiResponse({ status: 200, description: 'Return quiz' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findByCode(@Param('code') code: string) {
    return this.quizzesService.findByCode(code);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get quiz by ID' })
  @ApiResponse({ status: 200, description: 'Return quiz' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update quiz (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Quiz successfully updated' })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete quiz (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Quiz successfully deleted' })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start quiz (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Quiz successfully started' })
  startQuiz(@Param('id') id: string) {
    return this.quizzesService.startQuiz(id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete quiz (Teacher only)' })
  @ApiResponse({ status: 200, description: 'Quiz successfully completed' })
  completeQuiz(@Param('id') id: string) {
    return this.quizzesService.completeQuiz(id);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join quiz by code' })
  @ApiResponse({ status: 201, description: 'Successfully joined quiz' })
  joinQuiz(@Body() joinQuizDto: JoinQuizDto) {
    return this.quizzesService.joinQuiz(joinQuizDto);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get quiz leaderboard' })
  @ApiResponse({ status: 200, description: 'Return leaderboard' })
  getLeaderboard(@Param('id') id: string) {
    return this.quizzesService.getLeaderboard(id);
  }
}
