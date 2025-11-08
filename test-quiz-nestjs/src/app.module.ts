import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { TeamsModule } from './teams/teams.module';
import { TelegramModule } from './telegram/telegram.module';
import { QuizGatewayModule } from './quiz-gateway/quiz-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    QuizzesModule,
    QuestionsModule,
    AnswersModule,
    TeamsModule,
    TelegramModule,
    QuizGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
