import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  defaultPage() {
    return 'Rent Your Car!';
  }
}