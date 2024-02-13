import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Module

// Controller
import { PermissionController } from './permission.controller';

// Service
import { PermissionService } from './permission.service';
import { UserService } from '@/modules/user/user.service';

// Entity
import { Permission } from '@/modules/permission/permission.entity';
import { PermissionUser } from '@/modules/permission/permission-user.entity';
import { User } from '@/modules/user/user.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([Permission, PermissionUser, User])],
  providers: [PermissionService, UserService],
  controllers: [PermissionController],
})
export class PermissionModule {}
