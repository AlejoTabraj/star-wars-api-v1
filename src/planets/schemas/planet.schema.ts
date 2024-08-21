import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanetDocument = Planet & Document;

@Schema()
export class Planet {
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rotationPeriod: string;

  @Prop({ required: true })
  orbitalPeriod: string;

  @Prop({ required: true })
  diameter: string;

  @Prop({ required: true })
  climate: string;

  @Prop({ required: true })
  gravity: string;

  @Prop({ required: false })
  terrain: string;

  @Prop({ required: true })
  surfaceWater: string;

  @Prop({ required: true })
  population: string;

  @Prop({ type: [String], required: true })
  residents: string[];

  @Prop({ type: [String], required: true })
  films: string[];

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  edited: Date;

  @Prop({ required: true })
  url: string;
}

export const PlanetSchema = SchemaFactory.createForClass(Planet);
