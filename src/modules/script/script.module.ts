import { Module } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ScriptController } from './script.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Script } from './script.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Script])],
  providers: [ScriptService],
  controllers: [ScriptController],
})
export class ScriptModule {}
