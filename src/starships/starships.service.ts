import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Starship } from './schemas/starship.schema';
import { Model, Types } from 'mongoose';
import { MatchQuery } from '../common/interfaces/pagination.interface';
import { STAR_WARS_CATEGORY } from '../common/constants/app.constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryDto } from '../common/dto/paginated.dto';

@Injectable()
export class StarshipsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Starship.name) private readonly starshipModel: Model<Starship>
  ) { }

  async findPaginated({ page, pageSize, name }: QueryDto): Promise<{ documents: Starship[], totalPages: number }> {
    const skip = (page - 1) * pageSize;
    const match: MatchQuery = {};
    if (name) { match.name = { $regex: name, $options: "i" }};
    try {
      const totalCount = await this.starshipModel.countDocuments(match).exec();
      const documents = await this.starshipModel
        .find(match)
        .skip(skip)
        .limit(pageSize)
        .exec();
      const totalPages = Math.ceil(totalCount / pageSize);
      return { documents, totalPages };
    } catch (error) {
      this.logger
        .child({
          class: StarshipsService.name,
          method: this.findPaginated.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }

  async findOne(id: string): Promise<Starship> {
    try {
      const starships = await this.starshipModel.aggregate<Starship>([
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
            let: { urls: '$pilots' },
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
            as: 'pilots',
          }
        }
      ]);
      const starship = starships[0];
      if (!starship) {
        throw new BadRequestException(`Starship with ID ${id} not found`)
      }
      return starship;
    } catch (error) {
      this.logger
        .child({
          class: StarshipsService.name,
          method: this.findOne.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }

}
