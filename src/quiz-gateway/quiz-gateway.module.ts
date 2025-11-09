import { Module } from '@nestjs/common';
import { QuizGateway } from './quiz.gateway';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuestionsModule } from '../questions/questions.module';
import { AnswersModule } from '../answers/answers.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [QuizzesModule, QuestionsModule, AnswersModule, TelegramModule],
  providers: [QuizGateway],
  exports: [QuizGateway],
})
export class QuizGatewayModule {}
