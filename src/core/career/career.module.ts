import { Module } from '@nestjs/common';
import { CareerService } from './service/career.service';
import { CareerController } from './career.controller';

@Module({
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
