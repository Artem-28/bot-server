import { Test, TestingModule } from '@nestjs/testing';
import { DropdownOptionController } from './dropdown-option.controller';

describe('DropdownOptionController', () => {
  let controller: DropdownOptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DropdownOptionController],
    }).compile();

    controller = module.get<DropdownOptionController>(DropdownOptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
