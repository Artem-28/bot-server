import { Global, Module } from '@nestjs/common';
import { CheckPermissionService } from './check-permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CheckPermissionService],
  exports: [CheckPermissionService],
})
export class CheckPermissionModule {}
