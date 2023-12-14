import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Service
import { CheckPermissionService } from '@/modules/check-permission/check-permission.service';

// Entity
import { User } from '@/modules/user/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CheckPermissionService],
  exports: [CheckPermissionService],
})
export class CheckPermissionModule {}
