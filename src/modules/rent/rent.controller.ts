import { Body, Controller, ExecutionContext, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
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

  @Get('free')
  freeCars (): Promise<CarSchema[]> {
    return this.rentService.freeCars();
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