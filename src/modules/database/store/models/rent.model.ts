import { Injectable } from '@nestjs/common';
import { PgConnectionService } from '../../connection/connection.service';
import { RentCreate } from '../contracts/rent.create';
import { RentSchema } from '../schemas/rent.schema';
import { pgDate } from '../helpers/date.formats';

@Injectable()
export class RentModel {
  private connection: PgConnectionService;
  constructor(connection: PgConnectionService) {
    this.connection = connection;
  }

  async rentCar(rentData: RentCreate): Promise<RentSchema[]> {
    const dateDiff = rentData.endDate.getTime() - rentData.startDate.getTime();
    const duration = Math.round(dateDiff / (24 * 3600 * 1000)) + 1;

    const result = await this.connection.client.query(`
      INSERT INTO "UsersRent" (car_id_fk, startdate, enddate, duration, cost)
      VALUES (
        ${rentData.carId},
        '${pgDate(rentData.startDate)}',
        '${pgDate(rentData.endDate)}',
        ${duration},
        ${rentData.cost}
      )
      RETURNING
        car_id_fk AS car_id,
        startdate,
        enddate,
        duration,
        cost,
        rent_id
    `);

    return result.rows;
  }
}
