import { RentCreate } from "src/modules/database/store/contracts/rent.create";

export type RentCreateDto = Omit<RentCreate, "startDate" | "endDate" | "cost"> & {
  startDate: string;
  endDate: string;
}
