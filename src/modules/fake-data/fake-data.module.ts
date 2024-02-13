import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller
import { FakeDataController } from '@/modules/fake-data/fake-data.controller';

// Service
import { FakeDataService } from '@/modules/fake-data/fake-data.service';

// Entity
import { Project } from '@/modules/project/project.entity';
import { User } from '@/modules/user/user.entity';
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';
import { Permission } from '@/modules/permission/permission.entity';

// Guard

// Types

// Helper

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, DropdownOption, Permission]),
  ],
  controllers: [FakeDataController],
  providers: [FakeDataService],
})
export class FakeDataModule {}
