import { Test, TestingModule } from '@nestjs/testing';
import { DropdownOptionService } from './dropdown-option.service';

describe('DropdownOptionService', () => {
  let service: DropdownOptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DropdownOptionService],
    }).compile();

    service = module.get<DropdownOptionService>(DropdownOptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
