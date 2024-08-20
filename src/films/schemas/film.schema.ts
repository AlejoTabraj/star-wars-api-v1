import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Film extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episodeId: number;

  @Prop({ required: true })
  openingCrawl: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  producer: string;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ type: [String], required: true })
  characters: string[];

  @Prop({ type: [String], required: true })
  planets: string[];

  @Prop({ type: [String], required: true })
  starships: string[];

  @Prop({ type: [String], required: true })
  vehicles: string[];

  @Prop({ type: [String], required: true })
  species: string[];

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  edited: Date;

  @Prop({ required: true })
  url: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);

