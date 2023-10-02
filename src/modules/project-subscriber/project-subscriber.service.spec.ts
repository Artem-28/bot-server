import { Test, TestingModule } from '@nestjs/testing';
import { ProjectSubscriberService } from './project-subscriber.service';

describe('ProjectSubscriberService', () => {
  let service: ProjectSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectSubscriberService],
    }).compile();

    service = module.get<ProjectSubscriberService>(ProjectSubscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
