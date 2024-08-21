import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Person } from './schemas/person.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MatchQuery } from '../common/interfaces/pagination.interface';
import { STAR_WARS_CATEGORY } from '../common/constants/app.constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryDto } from '../common/dto/paginated.dto';

@Injectable()
export class PeopleService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @InjectModel(Person.name) private readonly personModel: Model<Person>
  ) { }

  async findPaginated({ page, pageSize, name }: QueryDto): Promise<{ documents: Person[], totalPages: number }> {
    const skip = (page - 1) * pageSize;
    const match: MatchQuery = {};
    if (name) { match.name = { $regex: name, $options: "i" }}

    try {
      const totalCount = await this.personModel.countDocuments().exec();
      const documents = await this.personModel
        .find(match)
        .skip(skip)
        .limit(pageSize)
        .exec();
      const totalPages = Math.ceil(totalCount / pageSize);
      return { documents, totalPages };
    } catch (error) {
      this.logger
        .child({
          class: PeopleService.name,
          method: this.findPaginated.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }

  async findOne(id: string): Promise<Person> {
    try {
      const people = await this.personModel.aggregate<Person>([
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
      const person = people[0];
      if (!person) {
        throw new NotFoundException(`Person with ID ${id} not found`);
      }
      return person;
    } catch (error) {
      this.logger
        .child({
          class: PeopleService.name,
          method: this.findOne.name,
          info: 'Ocurrió un error en esta llamada',
        })
        .error(error.message);
      throw new Error('Error fetching data');
    }
  }
}
