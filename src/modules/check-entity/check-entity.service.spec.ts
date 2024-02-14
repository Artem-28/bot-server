import { Test, TestingModule } from '@nestjs/testing';
import { CheckEntityService } from './check-entity.service';

describe('CheckEntityService', () => {
  let service: CheckEntityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckEntityService],
    }).compile();

    service = module.get<CheckEntityService>(CheckEntityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
