import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { AnswerController } from './answer.controller';

// Service
import { AnswerService } from './answer.service';

// Entity
import { Answer } from '@/modules/answer/answer.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Answer])],
  providers: [AnswerService],
  controllers: [AnswerController],
})
export class AnswerModule {}
