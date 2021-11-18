import { Module } from '@nestjs/common';
import { RentModule } from './modules/rent/rent.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    RentModule,
    ReportsModule
  ],
  controllers: [
    AppController
  ]
})
export class AppModule {}
