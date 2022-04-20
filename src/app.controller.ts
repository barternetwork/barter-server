import { Controller, Get, Bind, Req, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { MongoService } from "./mongo/mongo.service";

@Controller("")
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mongoService: MongoService,
  ) {
  }

  @Get("/getHello")
  @Bind(Req())
  async getHello(request):Promise< string >{
    console.log("getHello");
    console.log(request.query);
    console.log(request.body);
    return this.appService.getHello();
  }
}
