import { Module } from '@nestjs/common';
import { FakeDataController } from './fake-data.controller';
import { FakeDataService } from './fake-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Project } from '../project/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  controllers: [FakeDataController],
  providers: [FakeDataService],
})
export class FakeDataModule {}
