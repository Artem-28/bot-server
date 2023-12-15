import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller
import { ScriptController } from '@/modules/script/script.controller';

// Service
import { ScriptService } from '@/modules/script/script.service';

// Entity
import { Script } from '@/modules/script/script.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Script])],
  providers: [ScriptService],
  controllers: [ScriptController],
})
export class ScriptModule {}
