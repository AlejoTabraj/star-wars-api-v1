import { Test, TestingModule } from '@nestjs/testing';
import * as winston from 'winston';
import { getModelToken } from '@nestjs/mongoose';
import { PeopleService } from './people.service';
import { Person } from './schemas/person.schema';

describe('PlanetsService', () => {
  let service: PeopleService;
  let personModel: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: 'winston',
          useValue: winston.createLogger(),
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

    service = module.get<PeopleService>(PeopleService);
    personModel = module.get(getModelToken(Person.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
