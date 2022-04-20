import { Injectable } from "@nestjs/common";

@Injectable()
export class MongoService{

  async getHello(): Promise<any> {
    return 'Hello Mongo!';
  }
}
