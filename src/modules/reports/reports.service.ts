import { Injectable } from '@nestjs/common';
import { CarsUsedReport } from '../database/reports/reports/cars.used.report';
import { CarUsedResponseSchema } from '../database/reports/schemas/cars.used.response.schema';

@Injectable()
export class ReportsService {
  carUsedReport: CarsUsedReport;
  constructor(carUsedReport: CarsUsedReport) {
    this.carUsedReport = carUsedReport;
  }
  async carsUsed(
    month: number,
    year: number,
    carId?: number,
  ): Promise<CarUsedResponseSchema[]> {
    return await this.carUsedReport.getCarsUsedByMonth(month, year, carId);
  }
}
