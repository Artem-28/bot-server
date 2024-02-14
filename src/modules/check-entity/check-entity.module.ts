import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller

// Service
import { CheckEntityService } from './check-entity.service';

// Entity
import { User } from '@/modules/user/user.entity';
import { Script } from '@/modules/script/script.entity';

// Guard

// Types

// Helper

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Script])],
  providers: [CheckEntityService],
  exports: [CheckEntityService],
})
export class CheckEntityModule {}
