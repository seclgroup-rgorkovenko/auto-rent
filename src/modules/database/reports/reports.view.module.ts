import { Module } from '@nestjs/common';
import { PgConnectionModule } from '../connection/connection.module';
import { CarsUsedReport } from './reports/cars.used.report';

@Module({
  imports: [PgConnectionModule],
  providers: [CarsUsedReport],
  exports: [CarsUsedReport]
})
export class ReportsViewModule { }