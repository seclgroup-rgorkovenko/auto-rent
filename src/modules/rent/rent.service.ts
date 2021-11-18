import { Injectable } from '@nestjs/common';
import { RentCreate } from '../database/store/contracts/rent.create';
import { RentSchema } from '../database/store/schemas/rent.schema';
import { CarsModel, RentModel } from '../database/store/models';
import { CarSchema } from '../database/store/schemas/car.schema';
import {
  RENT_CAR_LOCKED,
  RENT_HOLIDAYS,
  RENT_STARTDATE_GREATER_ENDDATE,
  RENT_WRONG_RANGE,
  RENT_WRONG_DATEFORMAT
} from './constants/errors';
import {
  RENT_MAX_DAYS,
  RENT_BASE_COST,
  RENT_COST_DISCOUNTS
} from './constants/constants';

@Injectable()
export class RentService {
  private rentModel: RentModel;
  private carsModel: CarsModel;
  constructor (
    rentModel: RentModel,
    carsModel: CarsModel
  ) {
    this.carsModel = carsModel;
    this.rentModel = rentModel;
  }
  async freeCars (
    startDate: Date,
    endDate: Date
  ): Promise<CarSchema[]> {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
      throw RENT_WRONG_DATEFORMAT;
    if (startDate.getTime() > endDate.getTime())
      throw RENT_STARTDATE_GREATER_ENDDATE;

    return await this.carsModel.getFreeCars(startDate, endDate);
  }
  private async rentAvailable(data: RentCreate): Promise<void> {
    const maxRange = RENT_MAX_DAYS * (24 * 3600 * 1000);
    const { startDate, endDate, carId } = data;
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    const dateRange = startTimestamp - endTimestamp;
    const checkRange = dateRange <= maxRange;

    if (isNaN(startTimestamp) || isNaN(endTimestamp))
      throw RENT_WRONG_DATEFORMAT;
    if (startTimestamp > endTimestamp)
      throw RENT_STARTDATE_GREATER_ENDDATE
    if (!checkRange)
      throw RENT_WRONG_RANGE;
    if ([0, 6].includes(startDate.getDay())
      || [0, 6].includes(endDate.getDay()))
      throw RENT_HOLIDAYS;

    const freeCars = await this.carsModel.getFreeCars(startDate, endDate);
    const freeCar = freeCars.find((car: CarSchema) => car.id === carId);
    if (!freeCar)
      throw RENT_CAR_LOCKED;
  }
  private calculateRentCost(data: RentCreate): void {
    const dateDiff = data.endDate.getTime() - data.startDate.getTime();
    const duration = Math.round(dateDiff / (24 * 3600 * 1000)) + 1;

    const costs = RENT_COST_DISCOUNTS.reduce((acc, value) => {
      for (let i = value.start; i <= value.end; i++) {
        if (i <= duration)
        acc.push(RENT_BASE_COST - RENT_BASE_COST * value.discount);
      }

      return acc;
    } ,[]);

    data.cost = costs.reduce((acc, cost) => {
      return acc += cost;
    }, 0);
  }
  async rent (data: RentCreate): Promise<RentSchema[]> {
    await this.rentAvailable(data);
    this.calculateRentCost(data);
    return await this.rentModel.rentCar(data);
  }
}