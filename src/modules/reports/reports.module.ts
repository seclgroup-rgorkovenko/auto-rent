import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsViewModule } from '../database/reports/reports.view.module';

@Module({
  imports: [ReportsViewModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
