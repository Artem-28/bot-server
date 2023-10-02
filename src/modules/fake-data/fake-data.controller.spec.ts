import { Test, TestingModule } from '@nestjs/testing';
import { FakeDataController } from './fake-data.controller';

describe('FakeDataController', () => {
  let controller: FakeDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FakeDataController],
    }).compile();

    controller = module.get<FakeDataController>(FakeDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
