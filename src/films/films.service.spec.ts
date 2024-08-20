import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { getModelToken } from '@nestjs/mongoose';
import { FilmsService } from './films.service';
import { Film } from './schemas/film.schema';

describe('PlanetsService', () => {
  let service: FilmsService;
  let filmModel: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'winston',
          useValue: winston.createLogger(),
        },
        {
          provide: getModelToken(Film.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmModel = module.get(getModelToken(Film.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
