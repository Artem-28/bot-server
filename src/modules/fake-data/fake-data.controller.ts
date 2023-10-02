import { Controller, Post, HttpException, Body } from '@nestjs/common';
import { FakeDataService } from './fake-data.service';
import { FakeDataDto } from './dto/fake-data.dto';

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
