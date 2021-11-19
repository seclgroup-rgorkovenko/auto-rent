import { Module } from '@nestjs/common';
import { PgConnectionService } from './connection.service';

@Module({
  providers: [PgConnectionService],
  exports: [PgConnectionService],
})
export class PgConnectionModule {}
