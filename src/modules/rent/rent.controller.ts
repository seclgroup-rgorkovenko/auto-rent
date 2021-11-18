import { Body, Controller, ExecutionContext, Get, HttpException, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { RentService } from './rent.service';
import { CarSchema } from '../database/store/schemas/car.schema';
import { RentCreate } from '../database/store/contracts/rent.create';
import { RentSchema } from '../database/store/schemas/rent.schema';
import { RentCreateParser } from './dto/rent.create.parser';
import {
  RENT_WRONG_RANGE,
  RENT_STARTDATE_GREATER_ENDDATE,
  RENT_HOLIDAYS,
  RENT_CAR_LOCKED,
  RENT_WRONG_DATEFORMAT
} from './constants/errors';
import { SMTH_WENT_WRONG } from '../../common/errors';

@Controller('rent')
export class RentController {
  constructor (
    private readonly rentService: RentService
  ) { }

  @Get()
  async freeCars (
    @Query('start') startDate: Date = new Date(),
    @Query('end') endDate: Date = new Date()
  ): Promise<CarSchema[]> {
    try {
      return await this.rentService.freeCars(startDate, endDate);
    } catch (e) {
      const handledExceptions = [
        RENT_STARTDATE_GREATER_ENDDATE,
        RENT_WRONG_DATEFORMAT
      ].includes(e);

      if (handledExceptions) {
        throw new HttpException(e, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(SMTH_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post()
  async rent (
    @RentCreateParser() rentCar: RentCreate,
  ): Promise<RentSchema[]> {
    try {
      return await this.rentService.rent(rentCar);
    } catch (e) {
      const handledExceptions = [
        RENT_WRONG_RANGE,
        RENT_STARTDATE_GREATER_ENDDATE,
        RENT_HOLIDAYS,
        RENT_CAR_LOCKED,
        RENT_WRONG_DATEFORMAT
      ].includes(e);

      if (handledExceptions) {
        throw new HttpException(e, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException(SMTH_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
      
  }
}
