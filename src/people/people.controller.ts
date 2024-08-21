import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PeopleService } from './people.service';
import { QueryDto } from 'src/common/dto/paginated.dto';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true}))
  findPaginated(
    @Query() query: QueryDto
  ) {
    return this.peopleService.findPaginated(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.peopleService.findOne(id);
  }

}
