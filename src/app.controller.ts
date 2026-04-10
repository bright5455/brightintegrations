import {
  Controller,
  Get,
  Query,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('classify')
  async classify(@Query('name') name: any) {
    if (name === undefined || name === null || name === '') {
      throw new BadRequestException({
        status: 'error',
        message: 'Missing or empty name parameter',
      });
    }

    if (typeof name !== 'string') {
      throw new UnprocessableEntityException({
        status: 'error',
        message: 'name is not a string',
      });
    }

    return this.appService.classifyName(name);
  }
}