import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Module

// Controller

// Service

// Entity
import { DropdownOption } from '@/modules/dropdown-option/dropdown-option.entity';

// Guard

// Types
import { Options } from '@/base/interfaces/service.interface';

// Helper
import QueryBuilderHelper from '@/base/helpers/query-builder-helper';

@Injectable()
export class DropdownOptionService {
  constructor(
    @InjectRepository(DropdownOption)
    private readonly _dropdownRepository: Repository<DropdownOption>,
  ) {}

  public async getOptions(options: Options): Promise<DropdownOption[]> {
    const { filter, relation } = options;
    const queryHelper = new QueryBuilderHelper(this._dropdownRepository, {
      filter,
      relation,
    });

    return await queryHelper.builder.getMany();
  }
}
