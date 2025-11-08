import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendMessage(chatId: string, message: string): Promise<void> {
    if (!this.botToken || this.botToken === '') {
      this.logger.warn('Telegram bot token not configured. Skipping message send.');
      return;
    }

    try {
      await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      });
      this.logger.log(`Message sent to Telegram chat ${chatId}`);
    } catch (error) {
      this.logger.error(`Failed to send Telegram message: ${error.message}`);
    }
  }

  async sendQuizResults(
    telegramId: string,
    quizTitle: string,
    totalParticipants: number,
    topThree: Array<{ name: string; score: number }>,
  ): Promise<void> {
    if (!telegramId) {
      this.logger.warn('No Telegram ID provided. Skipping quiz results notification.');
      return;
    }

    let message = `🎯 <b>Quiz Completed: ${quizTitle}</b>\n\n`;
    message += `👥 Total Participants: ${totalParticipants}\n\n`;
    message += `🏆 <b>Top 3 Winners:</b>\n`;

    if (topThree.length === 0) {
      message += 'No participants completed the quiz.\n';
    } else {
      topThree.forEach((participant, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
        message += `${medal} ${index + 1}. ${participant.name} - ${participant.score} points\n`;
      });
    }

    await this.sendMessage(telegramId, message);
  }
}
