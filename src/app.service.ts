import { Injectable } from "@nestjs/common";
import { Connection as ConnectionMongo } from "mongoose";
import { InjectConnection as InjectMongo } from "@nestjs/mongoose";
import { InjectConnection as InjectMysql } from "@nestjs/typeorm";
import { DataSource as ConnectionMysql } from "typeorm";


@Injectable()
export class AppService {
  constructor(
    @InjectMongo() private connectionMongo: ConnectionMongo,
    @InjectMysql() private connectionMysql: ConnectionMysql
  ) {
  }

  async getHello(): Promise<any> {
    let mongo_data = await  this.connectionMongo.collection('block_avaxes').findOne({'from':'0xc8add10824b1c52758bc781581f90c4a64e6a54d'});
    let mysql_data = await this.connectionMysql.query("select * from users where wid=?", ["33552ed37bb057d9ff079626d320ace7"]);
    return {
      mongo_data,
      mysql_data
    };
  }
}
