import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubscriberController } from './project-subscriber.controller';

describe('ProjectSubscriberController', () => {
  let controller: ProjectSubscriberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectSubscriberController],
    }).compile();

    controller = module.get<ProjectSubscriberController>(ProjectSubscriberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
