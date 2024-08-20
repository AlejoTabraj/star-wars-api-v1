import { ObjectId } from "mongoose";

export interface PlanetDto {
  _id?: ObjectId
  name: string;
  rotationPeriod: string;
  orbitalPeriod: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surfaceWater: string;
  population: string;
  residents: string[];
  films: string[];
  created: Date;
  edited: Date;
  url: string;
}
