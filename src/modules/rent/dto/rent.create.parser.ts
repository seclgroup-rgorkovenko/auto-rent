import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RentCreateDto } from './rent.create.dto';
import { RentCreate } from '../../database/store/contracts/rent.create';
import { RENT_BASE_COST } from '../constants/constants';

export const RentCreateParser = createParamDecorator((data: RentCreateDto, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  data = request.body;
  const result: RentCreate = {
    carId: data.carId,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    cost: RENT_BASE_COST
  }

  return result;
});