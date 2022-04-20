import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransDocument = Trans & Document;

@Schema()
export class Trans{

  @Prop()
  from:string;
  @Prop()
  to:string;
  @Prop()
  hash:string;
}
export const TransSchema = SchemaFactory.createForClass(Trans);
