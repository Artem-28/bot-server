import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Module

// Controller

// Service
import { DropdownOptionService } from '@/modules/dropdown-option/dropdown-option.service';

// Entity

// Guard
import { AuthJwtGuard } from '@/modules/auth/passport/guards/auth-jwt.guard';

// Types
import { DropdownTypeEnum } from '@/base/enum/dropdown-option/dropdown-type.enum';

// Helper

@Controller('dropdown-options')
@UseGuards(AuthJwtGuard)
export class DropdownOptionController {
  constructor(readonly dropdownOptionService: DropdownOptionService) {}

  @Get('question-types')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getQuestionTypes() {
    try {
      return await this.dropdownOptionService.getOptions({
        filter: [
          { field: 'type', value: DropdownTypeEnum.QUESTION_TYPE },
          { field: 'enable', value: true },
        ],
      });
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
