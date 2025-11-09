import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiOperation({ summary: 'Submit an answer to a question' })
  @ApiResponse({ status: 201, description: 'Answer successfully submitted' })
  submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    return this.answersService.submitAnswer(submitAnswerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all answers' })
  @ApiQuery({ name: 'questionId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiResponse({ status: 200, description: 'Return all answers' })
  findAll(@Query('questionId') questionId?: string, @Query('userId') userId?: string) {
    return this.answersService.findAll(questionId, userId);
  }

  @Get('stats/:questionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get statistics for a question' })
  @ApiResponse({ status: 200, description: 'Return question statistics' })
  getQuestionStats(@Param('questionId') questionId: string) {
    return this.answersService.getQuestionStats(questionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get answer by ID' })
  @ApiResponse({ status: 200, description: 'Return answer' })
  @ApiResponse({ status: 404, description: 'Answer not found' })
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(id);
  }
}
