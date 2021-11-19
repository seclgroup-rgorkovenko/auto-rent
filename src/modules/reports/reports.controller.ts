import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CarUsedResponseSchema } from '../database/reports/schemas/cars.used.response.schema';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('workload/:year-:month')
  async carsUsed(
    @Param('month') month: number,
    @Param('year') year: number,
  ): Promise<CarUsedResponseSchema[]> {
    return await this.reportsService.carsUsed(month, year);
  }

  @Get('workload/:year-:month/:id')
  async carUsed(
    @Param('month') month: number,
    @Param('year') year: number,
    @Param('id') carId: number,
  ): Promise<CarUsedResponseSchema[]> {
    return await this.reportsService.carsUsed(month, year, carId);
  }
}
