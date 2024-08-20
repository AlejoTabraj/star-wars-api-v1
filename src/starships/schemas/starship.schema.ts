import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StarshipDocument = Starship & Document;

@Schema()
export class Starship {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  costInCredits: string;

  @Prop({ required: true })
  length: string;

  @Prop({ required: true })
  maxAtmospheringSpeed: string;

  @Prop({ required: true })
  crew: string;

  @Prop({ required: true })
  passengers: string;

  @Prop({ required: true })
  cargoCapacity: string;

  @Prop({ required: true })
  consumables: string;

  @Prop({ required: true })
  hyperdriveRating: string;

  @Prop({ required: true })
  MGLT: string;

  @Prop({ required: true })
  starshipClass: string;

  @Prop({ type: [String], required: true })
  pilots: string[];

  @Prop({ type: [String], required: true })
  films: string[];

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  edited: Date;

  @Prop({ required: true })
  url: string;
}

export const StarshipSchema = SchemaFactory.createForClass(Starship);
