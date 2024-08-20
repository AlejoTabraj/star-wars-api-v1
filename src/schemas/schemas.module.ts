import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { Planet, PlanetSchema } from 'src/planets/schemas/planet.schema'
import { PeopleSchema, Person } from 'src/people/schemas/person.schema'
import { Starship, StarshipSchema } from 'src/starships/schemas/starship.schema'
import { Film, FilmSchema } from 'src/films/schemas/film.schema'
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Planet.name, schema: PlanetSchema },
        { name: Person.name, schema: PeopleSchema },
        { name: Starship.name, schema: StarshipSchema },
        { name: Film.name, schema: FilmSchema }
      ]
    ),
  ],
  exports: [MongooseModule],
})
export class SchemasModule {}