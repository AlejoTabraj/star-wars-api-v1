import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Film } from './schemas/film.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MatchQuery } from '../common/interfaces/pagination.interface';
import { STAR_WARS_CATEGORY } from '../common/constants/app.constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryDto } from '../common/dto/paginated.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Film.name) private readonly filmModel: Model<Film>
  ) { }

  async findPaginated({ page, pageSize, name }: QueryDto): Promise<{ documents: Film[], totalPages: number }> {
    const skip = (page - 1) * pageSize;
    const match: MatchQuery = {};
    if (name) { match.name = { $regex: name, $options: "i" }}
    try {
      const totalCount = await this.filmModel.countDocuments().exec();
      const documents = await this.filmModel
        .find(match)
        .skip(skip)
        .limit(pageSize)
        .exec();
        const totalPages = Math.ceil(totalCount / pageSize);

        return { documents, totalPages };
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching data');
    }
  }

  async findOne(id: string): Promise<Film> {
    try {
      const films = await this.filmModel.aggregate<Film>([
        { $match: {
          _id: new Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: STAR_WARS_CATEGORY.PEOPLE,
            let: { urls: '$characters' },
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
            as: 'characters',
          }
        },
        {
          $lookup: {
            from: STAR_WARS_CATEGORY.PLANETS,
            let: { urls: '$planets' },
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
            as: 'planets',
          }
        },
        {
          $lookup: {
            from: STAR_WARS_CATEGORY.STARSHIPS,
            let: { urls: '$starships' },
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
            as: 'starships',
          }
        }
      ]);
      const film = films[0];
      if (!film) {
        throw new NotFoundException(`Film with ID ${id} not found`);
      }
      return film;
    } catch (error) {
      this.logger
        .child({
          class: FilmsService.name,
          method: this.findOne.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }
}
