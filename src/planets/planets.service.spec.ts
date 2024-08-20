import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { getModelToken } from '@nestjs/mongoose';
import { PlanetsService } from './planets.service';
import { Planet } from './schemas/planet.schema';

describe('PlanetsService', () => {
  let service: PlanetsService;
  let planetModel: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanetsService,
        {
          provide: 'winston', // Or the token used for injecting winston
          useValue: winston.createLogger(), // Provide a mock or the actual instance
        },
        {
          provide: getModelToken(Planet.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlanetsService>(PlanetsService);
    planetModel = module.get(getModelToken(Planet.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
