import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { QuizzesService } from '../quizzes/quizzes.service';
import { AnswersService } from '../answers/answers.service';
import { TelegramService } from '../telegram/telegram.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class QuizGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(QuizGateway.name);
  private quizRooms: Map<string, Set<string>> = new Map(); // quizId -> Set of socketIds

  constructor(
    private quizzesService: QuizzesService,
    private answersService: AnswersService,
    private telegramService: TelegramService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove from all rooms
    this.quizRooms.forEach((sockets, quizId) => {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.quizRooms.delete(quizId);
      }
    });
  }

  @SubscribeMessage('joinQuiz')
  async handleJoinQuiz(
    @MessageBody() data: { quizId: string; userId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { quizId, userId, userName } = data;

    try {
      // Join the quiz room
      client.join(`quiz-${quizId}`);

      // Track the socket
      if (!this.quizRooms.has(quizId)) {
        this.quizRooms.set(quizId, new Set());
      }
      this.quizRooms.get(quizId)?.add(client.id);

      this.logger.log(`User ${userName} (${userId}) joined quiz ${quizId}`);

      // Notify others in the room
      this.server.to(`quiz-${quizId}`).emit('participantJoined', {
        userId,
        userName,
        timestamp: new Date(),
      });

      // Get current quiz state
      const quiz = await this.quizzesService.findOne(quizId);
      const leaderboard = await this.quizzesService.getLeaderboard(quizId);

      return {
        success: true,
        quiz,
        leaderboard,
      };
    } catch (error) {
      this.logger.error(`Error joining quiz: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(
    @MessageBody() data: { quizId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { quizId } = data;

    try {
      const quiz = await this.quizzesService.startQuiz(quizId);

      // Broadcast to all participants
      this.server.to(`quiz-${quizId}`).emit('quizStarted', {
        quizId,
        startedAt: quiz.startedAt,
        firstQuestion: quiz.questions[0],
      });

      this.logger.log(`Quiz ${quizId} started`);

      // Start broadcasting questions
      this.broadcastQuestions(quizId, quiz.questions);

      return { success: true, quiz };
    } catch (error) {
      this.logger.error(`Error starting quiz: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: { questionId: string; userId: string; optionId: string; quizId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { questionId, userId, optionId, quizId } = data;

    try {
      const answer = await this.answersService.submitAnswer({
        questionId,
        userId,
        optionId,
      });

      // Get updated leaderboard
      const leaderboard = await this.quizzesService.getLeaderboard(quizId);

      // Broadcast updated leaderboard to all participants
      this.server.to(`quiz-${quizId}`).emit('leaderboardUpdate', leaderboard);

      this.logger.log(`Answer submitted by user ${userId} for question ${questionId}`);

      return {
        success: true,
        answer,
        isCorrect: answer.isCorrect,
      };
    } catch (error) {
      this.logger.error(`Error submitting answer: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('completeQuiz')
  async handleCompleteQuiz(
    @MessageBody() data: { quizId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { quizId } = data;

    try {
      await this.quizzesService.completeQuiz(quizId);

      // Get final leaderboard
      const leaderboard = await this.quizzesService.getLeaderboard(quizId);

      // Broadcast quiz completion
      this.server.to(`quiz-${quizId}`).emit('quizCompleted', {
        quizId,
        completedAt: new Date(),
        leaderboard,
      });

      this.logger.log(`Quiz ${quizId} completed`);

      // Send Telegram notification
      const quiz = await this.quizzesService.findOne(quizId);
      if (quiz.teacher.telegramId) {
        const topThree = leaderboard.participants.slice(0, 3).map((p) => ({
          name: `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() || 'Anonymous',
          score: p.score,
        }));

        await this.telegramService.sendQuizResults(
          quiz.teacher.telegramId,
          quiz.title,
          leaderboard.participants.length,
          topThree,
        );
      }

      return { success: true, leaderboard };
    } catch (error) {
      this.logger.error(`Error completing quiz: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getLeaderboard')
  async handleGetLeaderboard(
    @MessageBody() data: { quizId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { quizId } = data;

    try {
      const leaderboard = await this.quizzesService.getLeaderboard(quizId);
      return { success: true, leaderboard };
    } catch (error) {
      this.logger.error(`Error getting leaderboard: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private async broadcastQuestions(quizId: string, questions: any[]) {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const nextQuestion = questions[i + 1];

      // Wait before broadcasting (simulate time between questions)
      if (i > 0) {
        await this.delay(2000); // 2 seconds between questions
      }

      // Broadcast current question
      this.server.to(`quiz-${quizId}`).emit('newQuestion', {
        question: {
          id: question.id,
          text: question.text,
          order: question.order,
          timeLimit: question.timeLimit,
          options: question.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
            label: opt.label,
          })),
        },
        questionNumber: i + 1,
        totalQuestions: questions.length,
        hasNext: !!nextQuestion,
      });

      this.logger.log(`Broadcasting question ${i + 1} for quiz ${quizId}`);

      // Wait for question time limit
      await this.delay(question.timeLimit * 1000);

      // Get question stats
      const stats = await this.answersService.getQuestionStats(question.id);

      // Broadcast question results
      this.server.to(`quiz-${quizId}`).emit('questionResults', {
        questionId: question.id,
        stats,
        correctOption: question.options.find((opt) => opt.isCorrect),
      });

      // Get updated leaderboard
      const leaderboard = await this.quizzesService.getLeaderboard(quizId);
      this.server.to(`quiz-${quizId}`).emit('leaderboardUpdate', leaderboard);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Manual methods for teacher to control quiz flow
  broadcastQuestion(quizId: string, question: any) {
    this.server.to(`quiz-${quizId}`).emit('newQuestion', question);
  }

  broadcastLeaderboard(quizId: string, leaderboard: any) {
    this.server.to(`quiz-${quizId}`).emit('leaderboardUpdate', leaderboard);
  }
}
