import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getModelToken } from '@nestjs/mongoose';
import { TasksService } from './tasks.service';
import { Planet } from '../planets/schemas/planet.schema';
import { Film } from '../films/schemas/film.schema';
import { Starship } from '../starships/schemas/starship.schema';
import { Person } from '../people/schemas/person.schema';

describe('TasksService', () => {
  let service: TasksService;
  let httpService: HttpService;
  let configService: ConfigService;
  let logger: any;
  let planetModel: any;
  let filmModel: any;
  let starshipModel: any;
  let personModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://swapi.dev/api/'),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            child: jest.fn(),
          },
        },
        {
          provide: getModelToken(Planet.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Film.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Starship.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Person.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get(WINSTON_MODULE_PROVIDER);
    planetModel = module.get(getModelToken(Planet.name));
    filmModel = module.get(getModelToken(Film.name));
    starshipModel = module.get(getModelToken(Starship.name));
    personModel = module.get(getModelToken(Person.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('manageUpserts', () => {
    it('should call getEntity for each entity', () => {
     const getEntitySpy = jest.spyOn(service, 'getEntity').mockImplementation(() => Promise.resolve());

      service.manageUpserts();

      expect(getEntitySpy).toHaveBeenCalledTimes(4);
      expect(getEntitySpy).toHaveBeenCalledWith(planetModel, 'planets');
      expect(getEntitySpy).toHaveBeenCalledWith(filmModel, 'films');
      expect(getEntitySpy).toHaveBeenCalledWith(starshipModel, 'starships');
      expect(getEntitySpy).toHaveBeenCalledWith(personModel, 'people');
    });
  });

  describe('convertKeysToCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      const snakeCaseObject = { snake_case_property: 'value' };
      const camelCaseObject = service.convertKeysToCamelCase(snakeCaseObject);
      expect(camelCaseObject).toEqual({ snakeCaseProperty: 'value' });
    });

    it('should handle nested objects', () => {
      const snakeCaseObject = { snake_case_property: { inner_snake_case_property: 'value' } };
      const camelCaseObject = service.convertKeysToCamelCase(snakeCaseObject);
      expect(camelCaseObject).toEqual({ snakeCaseProperty: { innerSnakeCaseProperty: 'value' } });
    });

    it('should handle arrays', () => {
      const snakeCaseArray = [
        { snake_case_property: 'value1' },
        { snake_case_property: 'value2' },
      ];
      const camelCaseArray = service.convertKeysToCamelCase(snakeCaseArray);
      expect(camelCaseArray).toEqual([
        { snakeCaseProperty: 'value1' },
        { snakeCaseProperty: 'value2' },
      ]);
    });
  });
});