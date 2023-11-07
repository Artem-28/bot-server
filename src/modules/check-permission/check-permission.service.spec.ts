import { Test, TestingModule } from '@nestjs/testing';
import { CheckPermissionService } from './check-permission.service';

describe('CheckPermissionService', () => {
  let service: CheckPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckPermissionService],
    }).compile();

    service = module.get<CheckPermissionService>(CheckPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
