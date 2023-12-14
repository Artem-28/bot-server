import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller

// Service
import { UserService } from '@/modules/user/user.service';

// Entity
import { User } from '@/modules/user/user.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
})
export class UserModule {}
