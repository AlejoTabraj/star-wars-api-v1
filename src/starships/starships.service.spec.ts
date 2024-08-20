import { Test, TestingModule } from '@nestjs/testing';
import { StarshipsService } from './starships.service';
import * as winston from 'winston';
import { getModelToken } from '@nestjs/mongoose';
import { Starship } from './schemas/starship.schema';

describe('StarshipsService', () => {
  let service: StarshipsService;
  let starshipModel: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarshipsService,
        {
          provide: 'winston', // Or the token used for injecting winston
          useValue: winston.createLogger(), // Provide a mock or the actual instance
        },
        {
          provide: getModelToken(Starship.name),
          useValue: {
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StarshipsService>(StarshipsService);
    starshipModel = module.get(getModelToken(Starship.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
