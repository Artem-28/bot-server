import { Controller, Post, HttpException, Body } from '@nestjs/common';

// Module

// Controller

// Service
import { FakeDataService } from '@/modules/fake-data/fake-data.service';

// Entity

// Guard

// Types
import { FakeDataDto } from '@/modules/fake-data/dto/fake-data.dto';

// Helper

@Controller('fake-data')
export class FakeDataController {
  constructor(readonly fakeDataService: FakeDataService) {}

  @Post('seed')
  async seed(@Body() body: FakeDataDto) {
    try {
      await this.fakeDataService.seed(body);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
