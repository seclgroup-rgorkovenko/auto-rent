import { Module } from '@nestjs/common';
import { PgConnectionModule } from '../connection/connection.module';

import * as Models from './models';

@Module({
  imports: [PgConnectionModule],
  providers: [
    Models.CarsModel,
    Models.RentModel
  ],
  exports: [
    Models.CarsModel,
    Models.RentModel
  ]
})
export class StoreModule { }