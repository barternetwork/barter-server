import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MongoService } from "./mongo/mongo.service";
import { MongooseModule } from '@nestjs/mongoose';
import {TransSchema} from "./mongo/scemas";

import CustomConfig from './config';
let mongo = CustomConfig().mongo;
let mysql = CustomConfig().mysql;
let MysqlModules = [];
let mysqlNames = Object.keys(mysql);
for (const name of mysqlNames) {
  MysqlModules.push(TypeOrmModule.forRoot({
    ...mysql[name],
    type: 'mysql',
    synchronize: true,
    name:mysqlNames.length==1?"":name
  }))
}

@Module({

  imports: [
    ConfigModule.forRoot({
      load:[CustomConfig]
    }),
    ...MysqlModules,
    MongooseModule.forRoot(mongo.url),
    MongooseModule.forFeature([{name:'block_avax',schema:TransSchema}]),
  ],
  controllers: [AppController],
  providers: [AppService,MongoService],

})
export class AppModule {}
