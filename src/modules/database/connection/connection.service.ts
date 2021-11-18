import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Client } from "pg";

@Injectable()
export class PgConnectionService implements OnModuleDestroy {
  public client: Client;
  constructor() {
    this.client = new Client({
      host: process.env.PGHOST,
      user: process.env.PGUSER,
      database: process.env.PGDATABASE,
      password: ""+process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT),
    });

    this.client.connect();
  }

  onModuleDestroy() {
    this.client.end().catch(e=>{
      console.error(e)
    });
  }
}