import { Injectable } from "@nestjs/common";
import { PgConnectionService } from "../../connection/connection.service";
import { pgDate } from "../../store/helpers/date.formats";
import { CarUsedResponseSchema } from "../schemas/cars.used.response.schema";

@Injectable()
export class CarsUsedReport {
  private connection: PgConnectionService;
  constructor(connection: PgConnectionService) {
    this.connection = connection;
  }

  async getCarsUsedByMonth(
    month: number,
    year: number,
    carId?: number,
  ): Promise<CarUsedResponseSchema[]> {
    const { client } = this.connection;
    const date = new Date((new Date()).setFullYear(year, month - 1, 1));

    let carFilter = '';
    if (!isNaN(carId)) {
      carFilter = `
        where car_id_fk = ${carId}
      `
    }
    const query = await client.query(`
      create temp table "t_ranges" on commit drop as
      select
        car_id_fk,
        startdate,
        enddate,
        duration,
        monthrange.end - monthrange.start as month_day_duration,
        case when (monthrange.start - startdate::timestamp) > interval '1 day'
          then monthrange.start
          else startdate::timestamp end
        as res_start,
        case when (monthrange.end - enddate::timestamp) < interval '1 day'
          then monthrange.end
          else enddate::timestamp + interval '1 day' end
        as res_end,
        tsrange(
          case when (monthrange.start - startdate::timestamp) > interval '1 day'
          then monthrange.start
          else startdate::timestamp end,
          
          case when (monthrange.end - enddate::timestamp) < interval '1 day'
          then monthrange.end
          else enddate::timestamp + interval '1 day' end
        ) as found_range
      from "UsersRent",
      (SELECT
        (date_trunc('month', date('${pgDate(date)}')))::timestamp as start,
        (date_trunc('month', date('${pgDate(date)}')) + '1 mon'::interval)::timestamp as end
      ) as monthrange
      where 
        tsrange(startdate::timestamp, (enddate + interval '1 day')::timestamp)
        && tsrange(monthrange.start, monthrange.end);
      select
        car_id_fk as car_id,
        "Cars".platenum,
        sum(ROUND((EXTRACT(epoch FROM (res_end - res_start))/86400) * 100 /
        (EXTRACT(epoch FROM month_day_duration)/86400), 2))::float as percent_rent,
        sum(ROUND(EXTRACT(epoch FROM (res_end - res_start))/86400, 0))::integer as count_days
      from "t_ranges"
        left join "Cars"
          on "Cars".id = "t_ranges".car_id_fk
      ${carFilter}
      group by
        car_id_fk,
        "Cars".platenum
    `);
    const result: CarUsedResponseSchema[] = query[1].rows;
    return result;
  }
}