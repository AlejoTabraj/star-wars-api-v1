import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Planet } from './schemas/planet.schema';
import { Model, Types } from 'mongoose';
import { MatchQuery } from '../common/interfaces/pagination.interface';
import { STAR_WARS_CATEGORY } from '../common/constants/app.constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryDto } from '../common/dto/paginated.dto';

@Injectable()
export class PlanetsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Planet.name) private readonly planetModel: Model<Planet>
  ) { }

  async findPaginated({ page, pageSize, name }: QueryDto): Promise<{ documents: Planet[], totalPages: number }> {
    const skip = (page - 1) * pageSize;
    const match: MatchQuery = {};
    if (name) { match.name = { $regex: name, $options: "i" }};
    try {
      const totalCount = await this.planetModel.countDocuments(match).exec();
      const documents = await this.planetModel
        .find(match)
        .skip(skip)
        .limit(pageSize)
        .exec();
      const totalPages = Math.ceil(totalCount / pageSize);
      return { documents, totalPages };
    } catch (error) {
      this.logger
        .child({
          class: PlanetsService.name,
          method: this.findPaginated.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }

  async findOne(id: string): Promise<Planet> {
    try {
      const planets = await this.planetModel.aggregate<Planet>([
        {
          $match: {
            _id: new Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: STAR_WARS_CATEGORY.FILMS,
            let: { urls: '$films' },
            pipeline: [
              {
                $match:
                {
                  $expr:
                  {
                    $and:
                      [
                        { $in: ["$url", "$$urls"] },
                      ]
                  }
                }
              },
              { $project: { title: 1, _id: 1 } }
            ],
            as: 'films',
          }
        },
        {
          $lookup: {
            from: STAR_WARS_CATEGORY.PEOPLE,
            let: { urls: '$residents' },
            pipeline: [
              {
                $match:
                {
                  $expr:
                  {
                    $and:
                      [
                        { $in: ["$url", "$$urls"] },
                      ]
                  }
                }
              },
              { $project: { name: 1, _id: 1 } }
            ],
            as: 'residents',
          }
        }
      ]);
      const planet = planets[0];
      if (!planet) {
        throw new NotFoundException(`Planet with ID ${id} not found`);
      }
      return planet;
    } catch (error) {
      this.logger
        .child({
          class: PlanetsService.name,
          method: this.findOne.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }
}
