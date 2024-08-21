import { Model } from "mongoose";
import { Film } from "src/films/schemas/film.schema";
import { Person } from "src/people/schemas/person.schema";
import { Starship } from "src/starships/schemas/starship.schema";

export interface FindPaginated {
    page: number;
    pageSize: number;
    name?: string;
  }

  export interface MatchQuery {
    name?: { $regex: string; $options: string };
  }
  export interface FetchResponse <T extends Document> {
    data?: Model<T[]>;
    nextBatchUrl: string;
    results: Model<T[]>;
  }

  export type StarWarsEntity = Film | Starship | Person;