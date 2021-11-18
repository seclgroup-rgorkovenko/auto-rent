import { Injectable } from "@nestjs/common";
import { PgConnectionService } from "../../connection/connection.service";
import { CarSchema } from "../schemas/car.schema";
import { pgDate } from "../helpers/date.formats";

@Injectable()
export class CarsModel {
  private connection: PgConnectionService;
  constructor(connection: PgConnectionService) {
    this.connection = connection;
  }

  async getFreeCars(
    startDate: Date = (new Date()),
    endDate: Date = (new Date())
  ): Promise<CarSchema[]> {
    const { client } = this.connection;
  
    const result = await client.query(`
      SELECT
        "Cars".id,
        "Cars".platenum
      FROM "Cars"
      LEFT JOIN (
        SELECT
          car_id_fk,
          true AS locked
        FROM "UsersRent"
        WHERE
          tsrange(startdate::timestamp, (enddate + interval '4 day')::timestamp)
          && tsrange('${pgDate(startDate)}'::timestamp,
            (date('${pgDate(endDate)}') + interval '1 day')::timestamp)
        GROUP BY
          car_id_fk
      ) AS "FreeCar" ON "Cars".id = "FreeCar".car_id_fk
      WHERE
        CASE WHEN "FreeCar".locked IS null THEN false ELSE true END = false
    `);
  
    return result.rows;
  }
}