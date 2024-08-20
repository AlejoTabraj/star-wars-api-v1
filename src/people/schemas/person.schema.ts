import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Person extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  height: string;

  @Prop({ required: true })
  mass: string;

  @Prop({ required: true })
  hairColor: string;

  @Prop({ required: true })
  skinColor: string;

  @Prop({ required: true })
  eyeColor: string;

  @Prop({ required: true })
  birthYear: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  homeworld: string;

  @Prop({ type: [String], required: true })
  films: string[];

  @Prop({ type: [String] })
  species: string[];

  @Prop({ type: [String] })
  vehicles: string[];

  @Prop({ type: [String] })
  starships: string[];

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  edited: Date;

  @Prop({ required: true })
  url: string;
}

export const PeopleSchema = SchemaFactory.createForClass(Person);


export interface Person extends Document {
  name: string;
  height: string;
  mass: string;
  hairColor: string;
  skinColor: string;
  eyeColor: string;
  birthYear: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: Date;
  edited: Date;
  url: string;
}


