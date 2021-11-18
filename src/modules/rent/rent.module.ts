import { Module } from "@nestjs/common";
import { StoreModule } from "../database/store/store.module";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";

@Module({
  imports: [StoreModule],
  controllers: [RentController],
  providers: [RentService]
})
export class RentModule { }