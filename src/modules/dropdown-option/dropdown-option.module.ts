import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module

// Controller
import { DropdownOptionController } from './dropdown-option.controller';

// Service
import { DropdownOptionService } from './dropdown-option.service';

// Entity
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';

// Guard

// Types

// Helper

@Module({
  imports: [TypeOrmModule.forFeature([DropdownOption])],
  providers: [DropdownOptionService],
  controllers: [DropdownOptionController],
})
export class DropdownOptionModule {}
