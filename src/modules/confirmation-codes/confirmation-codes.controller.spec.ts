import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationCodesController } from './confirmation-codes.controller';

describe('ConfirmationCodeController', () => {
  let controller: ConfirmationCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationCodesController],
    }).compile();

    controller = module.get<ConfirmationCodesController>(ConfirmationCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
