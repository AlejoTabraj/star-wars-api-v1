import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { catchError, EMPTY, expand, map, Observable, of, reduce } from 'rxjs';
import { ENTITY_NAMES, STAR_WARS_CATEGORY } from '../common/constants/app.constants';
import { Film } from '../films/schemas/film.schema';
import { Person } from '../people/schemas/person.schema';
import { PlanetDto } from '../planets/dto/planet.dto';
import { Planet } from '../planets/schemas/planet.schema';
import { Starship } from '../starships/schemas/starship.schema';
import { Logger } from 'winston';

@Injectable()
export class TasksService {
  private readonly baseUrl: string;
  constructor(
    private readonly http: HttpService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Planet.name) private readonly planetModel: Model<Planet>,
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
    @InjectModel(Starship.name) private readonly starshipModel: Model<Starship>,
    @InjectModel(Person.name) private readonly personModel: Model<Person>,
  ) {
    this.baseUrl = configService.get('SWAPI_BASE_URL');
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  handleexecuteEveryDay() {
    this.manageUpserts();
  }

  manageUpserts() {
    for (const name of ENTITY_NAMES) {
      switch (name) {
        case STAR_WARS_CATEGORY.PLANETS:
          this.getEntity(this.planetModel, name)
          break
        case STAR_WARS_CATEGORY.FILMS:
          this.getEntity(this.filmModel, name)
          break
        case STAR_WARS_CATEGORY.STARSHIPS:
          this.getEntity(this.starshipModel, name)
          break
        case STAR_WARS_CATEGORY.PEOPLE:
          this.getEntity(this.personModel, name)
          break
        default:
          break
      }
    }
  }

  getEntity(model, name): any {
    const responseFetch = this.fetchBatch(this.baseUrl + name).pipe(
      expand((response) => {
        if (response.nextBatchUrl) {
          return this.fetchBatch(response.nextBatchUrl);
        } else {
          return EMPTY;
        }
      }),
      map((response) => {
        return response.results
      }),
      catchError((error) => {
        this.logger
        .child({
          class: TasksService.name,
          method: this.getEntity.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
        return of([]);
      }),
      reduce((acc, data) => acc.concat(data), [])
    );

    responseFetch.subscribe({
      next: (result) => {
        result && this.upsertRecords(model, result)
      },
      error: (error) => {
        this.logger
        .child({
          class: TasksService.name,
          method: this.getEntity.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      },
      complete: () => {
        console.log('Operación completada');
      }
    });
  }

  fetchBatch(url: string): Observable<{
    results: any; data: any, nextBatchUrl?: string
  }> {
    return this.http.get(url).pipe(
      map((response) => {
        const data = response.data
        const { next: nextBatchUrl, results } = data;
        console.log({ results })
        return { data, nextBatchUrl, results };
      })
    );
  }

  async upsertRecords(model, records: PlanetDto[]): Promise<void> {
    for (const record of records) {
      const existingRecord = await model.findOne({ url: record.url }, { _id: true }).exec();
      const data = this.convertKeysToCamelCase(record)
      if (existingRecord) {
        if (existingRecord.edited < record.edited) {
          await model.updateOne(
            { _id: record._id },
            { $set: data },
          ).exec();
        }
      } else {
        await model.create(data);
      }
    }
  }

  toCamelCase(snakeCaseStr: string): string {
    return snakeCaseStr.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
  }

  convertKeysToCamelCase<T>(obj: T | T[]): T | T[] {
    if (obj === null || obj === undefined) {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.convertKeysToCamelCase(item)) as T;
    }
    if (typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = this.toCamelCase(key);
        acc[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
        return acc;
      }, {} as { [key: string]: any }) as T;
    }
    return obj;
  }
}
