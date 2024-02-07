import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { QuestionController } from './question.controller';

// Service
import { QuestionService } from './question.service';

// Entity
import { Question } from '@/modules/question/question.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
